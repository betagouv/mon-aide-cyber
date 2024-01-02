import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  Question,
  ReponseDonnee,
  ReponsePossible,
  Thematique,
} from '../../domaine/diagnostic/Referentiel.ts';
import { UUID } from '../../types/Types.ts';
import {
  diagnosticCharge,
  reducteurDiagnostic,
  thematiqueAffichee,
} from '../../domaine/diagnostic/reducteurDiagnostic.ts';
import { FournisseurEntrepots } from '../../fournisseurs/FournisseurEntrepot.ts';
import {
  EtatReponseStatut,
  initialiseReducteur,
  reducteurReponse,
  reponseEnvoyee,
  reponseMultipleDonnee,
  reponseTiroirMultipleDonnee,
  reponseTiroirUniqueDonnee,
  reponseUniqueDonnee,
} from '../../domaine/diagnostic/reducteurReponse.ts';
import {
  Action,
  ActionBase,
  ActionReponseDiagnostic,
} from '../../domaine/diagnostic/Diagnostic.ts';
import '../../assets/styles/_diagnostic.scss';
import { BoutonThematique } from './BoutonThematique.tsx';
import '../../assets/styles/_couleurs.scss';

import {
  reducteurBoutonThematiquePrecedente,
  reducteurBoutonThematiqueSuivante,
} from './reducteurBoutonThematique.ts';
import styled from 'styled-components';
import { FooterDiagnostic } from './FooterDiagnostic.tsx';
import { HeaderDiagnostic } from './HeaderDiagnostic.tsx';

type ProprietesComposantQuestion = {
  question: Question;
  reponseDonnee?: ReponseDonnee;
  actions: ActionReponseDiagnostic[];
};

type ProprietesChampsDeSaisie = {
  identifiant: string;
};

const ChampsDeSaisie = ({ identifiant }: ProprietesChampsDeSaisie) => {
  return (
    <div>
      <input
        id={`asaisir-${identifiant}`}
        name={identifiant}
        type="text"
        required={true}
      />
    </div>
  );
};

type ProprietesComposantReponsePossible = {
  identifiantQuestion: string;
  reponsePossible: ReponsePossible;
  typeDeSaisie: 'radio' | 'checkbox';
  onChange: (identifiantReponse: string) => void;
  selectionnee: boolean;
};

const ComposantReponsePossible = (
  proprietes: PropsWithChildren<ProprietesComposantReponsePossible>,
) => {
  const champsASaisir =
    proprietes.reponsePossible.type?.type === 'saisieLibre' ? (
      <ChampsDeSaisie identifiant={proprietes.reponsePossible.identifiant} />
    ) : (
      ''
    );

  return (
    <div
      className={`fr-${proprietes.typeDeSaisie}-group mac-${proprietes.typeDeSaisie}-group`}
    >
      <input
        id={proprietes.reponsePossible.identifiant}
        type={proprietes.typeDeSaisie}
        name={proprietes.identifiantQuestion}
        value={proprietes.reponsePossible.identifiant}
        checked={proprietes.selectionnee}
        onChange={(event) => {
          proprietes.onChange(event.target.value);
        }}
      />
      <label
        className="fr-label"
        htmlFor={proprietes.reponsePossible.identifiant}
      >
        {proprietes.reponsePossible.libelle}
      </label>
      <div>{champsASaisir}</div>
      {proprietes.children}
    </div>
  );
};

const ComposantQuestionListe = ({
  question,
  actions,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question, actions),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      envoie(reponseUniqueDonnee(event.target.value));
    },
    [envoie],
  );

  const reponseQuestionEnvoyee = useCallback(() => {
    envoie(reponseEnvoyee());
  }, [envoie]);

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIEE) {
      const action = etatReponse.action('repondre');
      if (action !== undefined) {
        entrepots
          .diagnostic()
          .repond(action, etatReponse.reponse()!)
          .then(() => reponseQuestionEnvoyee());
      }
    }
  }, [actions, entrepots, etatReponse, question, reponseQuestionEnvoyee]);

  return (
    <div className="fr-select-group">
      <label className="fr-label" htmlFor={`select-${question.identifiant}`}>
        <h5>{question.libelle}</h5>
      </label>
      <select
        onChange={repond}
        className="fr-select mac-select"
        id={`select-${question.identifiant}`}
      >
        <option value="" disabled hidden selected>
          Sélectionnez une valeur
        </option>
        {question.reponsesPossibles.map((reponse) => {
          return (
            <option
              key={reponse.identifiant}
              value={reponse.identifiant}
              selected={etatReponse.valeur() === reponse.identifiant}
            >
              {reponse.libelle}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const ComposantQuestion = ({
  question,
  actions,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question, actions),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repondQuestionUnique = useCallback(
    (identifiantReponse: string) => {
      envoie(reponseUniqueDonnee(identifiantReponse));
    },
    [envoie],
  );

  const repondQuestionMultiple = useCallback(
    (elementReponse: { identifiantReponse: string; reponse: string }) => {
      envoie(reponseMultipleDonnee(elementReponse));
    },
    [envoie],
  );

  const repondQuestionTiroirUnique = useCallback(
    (
      identifiantReponse: string,
      elementReponse: {
        identifiantReponse: string;
        reponse: string;
      },
    ) => {
      envoie(reponseTiroirUniqueDonnee(identifiantReponse, elementReponse));
    },
    [envoie],
  );

  const repondQuestionTiroirMultiple = useCallback(
    (
      identifiantReponse: string,
      elementReponse: {
        identifiantReponse: string;
        reponse: string;
      },
    ) => {
      envoie(reponseTiroirMultipleDonnee(identifiantReponse, elementReponse));
    },
    [envoie],
  );

  const reponseQuestionEnvoyee = useCallback(() => {
    envoie(reponseEnvoyee());
  }, [envoie]);

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIEE) {
      const action = etatReponse.action('repondre');
      if (action !== undefined) {
        entrepots
          .diagnostic()
          .repond(action, etatReponse.reponse()!)
          .then(() => {
            reponseQuestionEnvoyee();
          });
      }
    }
  }, [actions, entrepots, etatReponse, question, reponseQuestionEnvoyee]);
  return (
    <>
      <label className="fr-label">
        <h5>{question.libelle}</h5>
      </label>
      <div className="fr-fieldset__content">
        {question.reponsesPossibles.map((reponse) => {
          const typeDeSaisie =
            question.type === 'choixUnique' ? 'radio' : 'checkbox';
          return (
            <ComposantReponsePossible
              key={reponse.identifiant}
              reponsePossible={reponse}
              identifiantQuestion={question.identifiant}
              typeDeSaisie={typeDeSaisie}
              onChange={(identifiantReponse) =>
                typeDeSaisie === 'radio'
                  ? repondQuestionUnique(identifiantReponse)
                  : repondQuestionMultiple({
                      identifiantReponse: question.identifiant,
                      reponse: identifiantReponse,
                    })
              }
              selectionnee={
                typeDeSaisie === 'radio'
                  ? etatReponse.valeur() === reponse.identifiant
                  : etatReponse.reponseDonnee.reponses.some((rep) =>
                      rep.reponses.has(reponse.identifiant),
                    )
              }
            >
              {reponse.questions?.map((questionTiroir) => (
                <div
                  className="question-tiroir"
                  key={questionTiroir.identifiant}
                >
                  <legend className="fr-fieldset__legend">
                    {questionTiroir.libelle}
                  </legend>
                  {questionTiroir.reponsesPossibles.map((rep) => {
                    const typeDeSaisie =
                      questionTiroir?.type === 'choixMultiple'
                        ? 'checkbox'
                        : 'radio';

                    return (
                      <ComposantReponsePossible
                        key={rep.identifiant}
                        reponsePossible={rep}
                        identifiantQuestion={questionTiroir.identifiant}
                        typeDeSaisie={typeDeSaisie}
                        selectionnee={etatReponse.reponseDonnee.reponses.some(
                          (reponse) => reponse.reponses.has(rep.identifiant),
                        )}
                        onChange={(identifiantReponse) => {
                          typeDeSaisie === 'checkbox'
                            ? repondQuestionTiroirMultiple(
                                reponse.identifiant,
                                {
                                  identifiantReponse:
                                    questionTiroir.identifiant,
                                  reponse: identifiantReponse,
                                },
                              )
                            : repondQuestionTiroirUnique(reponse.identifiant, {
                                identifiantReponse: questionTiroir.identifiant,
                                reponse: identifiantReponse,
                              });
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </ComposantReponsePossible>
          );
        })}
      </div>
    </>
  );
};

const BoutonNavigeVersThematique = styled.button<{
  $localisationIcone: string;
}>`
  mask-image: url(${(props) => props.$localisationIcone});
  mask-repeat: no-repeat;
  -webkit-mask-image: url(${(props) => props.$localisationIcone});
  -webkit-mask-repeat: no-repeat;
  background-color: var(--couleurs-mac-blanc) !important;
`;

type ProprietesComposantDiagnostic = {
  idDiagnostic: UUID;
};

export const ComposantDiagnostic = ({
  idDiagnostic,
}: ProprietesComposantDiagnostic) => {
  const [etatReferentiel, envoie] = useReducer(reducteurDiagnostic, {
    diagnostic: undefined,
    thematiqueAffichee: undefined,
  });
  const [lienCopie, setLienCopie] = useState(<></>);
  const [boutonDesactive, setBoutonDesactive] = useState(false);

  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    entrepots
      .diagnostic()
      .lis(idDiagnostic)
      .then((diagnostic) => envoie(diagnosticCharge(diagnostic)))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, idDiagnostic, envoie, showBoundary]);

  let thematiques: [string, Thematique][] = [];
  let actions: Action[] = useMemo(() => [], []);
  if (etatReferentiel.diagnostic?.referentiel !== undefined) {
    thematiques = Object.entries(etatReferentiel.diagnostic!.referentiel!);
    actions = etatReferentiel.diagnostic!.actions;
  }

  const affiche = useCallback(
    (clef: string) => {
      envoie(thematiqueAffichee(clef));
      window.scrollTo({ top: 0 });
    },
    [envoie],
  );

  const spinner = (
    <div className="blanc">
      <div className="loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path-outline"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="1"
            strokeMiterlimit="10"
          />
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="1"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>
  );

  const termineDiagnostic = useCallback(async () => {
    setBoutonDesactive(true);
    const action = actions.find((a) => a.action === 'terminer');
    if (action) {
      return entrepots
        .diagnostic()
        .termine(action as ActionBase)
        .then(() => {
          setBoutonDesactive(false);
        });
    }
  }, [actions, entrepots]);

  const fermeAlerte = useCallback(() => {
    setLienCopie(<></>);
  }, []);

  const copierLienDiagnostic = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setLienCopie(() => (
      <div className="fr-alert fr-alert--success fr-mb-1w">
        <h3 className="fr-alert__title">Lien copié avec succès</h3>
        <p>Le lien du diagnostic a été copié dans votre presse-papier</p>
        <button
          className="fr-btn--close fr-btn"
          title="Masquer le message"
          onClick={fermeAlerte}
        >
          Masquer le message
        </button>
      </div>
    ));
  }, [fermeAlerte]);

  const navigation = (
    <nav className="navigation-thematiqes">
      <ul className="thematiques">
        {thematiques.map(([clef, thematique]) => (
          <li
            key={`li-${clef}`}
            className={
              etatReferentiel.thematiqueAffichee === clef
                ? 'mac-thematique--active'
                : ''
            }
          >
            <BoutonNavigeVersThematique
              $localisationIcone={thematique.localisationIconeNavigation}
              className={`fr-btn`}
              onClick={() => affiche(clef)}
              title=""
            />
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <HeaderDiagnostic
        terminer={{
          active: boutonDesactive,
          termineDiagnostic: () => termineDiagnostic(),
        }}
        copier={{ copier: () => copierLienDiagnostic() }}
      />
      <main role="main" className="diagnostic-main">
        <div className="fr-grid-row fr-grid-row--gutters fond-clair-mac">
          <div className="conteneur-navigation">{navigation}</div>
          {thematiques.map(([clef, thematique]) => {
            const actionsPossibles: ActionReponseDiagnostic[] = actions.filter(
              (action) => Object.entries(action).find(([c]) => c === clef),
            ) as ActionReponseDiagnostic[];
            const elements = thematique.questions.map((question) => (
              <fieldset
                key={question.identifiant}
                id={question.identifiant}
                className="fr-fieldset fr-mb-5w section-diagnostic"
              >
                {question.type === 'liste' ? (
                  <ComposantQuestionListe
                    question={question}
                    actions={actionsPossibles}
                  />
                ) : (
                  <ComposantQuestion
                    question={question}
                    actions={actionsPossibles}
                  />
                )}
              </fieldset>
            ));
            return (
              <div
                key={clef}
                className={`
                ${
                  etatReferentiel.thematiqueAffichee === clef
                    ? `visible`
                    : `invisible`
                }
               conteneur-thematique`}
              >
                {boutonDesactive && spinner}
                {lienCopie}
                <div className="bandeau-thematique">
                  <div className="fr-container fr-pt-md-4w">
                    <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
                      <div className="fr-col-7 introduction-thematique">
                        <h2>{thematique.libelle}</h2>
                      </div>
                      <div className="fr-col-5">
                        <img
                          src={thematique.localisationIllustration}
                          alt="illustration de la thématique"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fr-container">
                  <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
                    <div className="fr-col-md-8 fr-col-8">
                      <form id={clef}>
                        <section className="question">{elements}</section>
                      </form>
                    </div>
                    <div className="fr-col-md-4 fr-col-4"></div>
                  </div>
                </div>
                <div className="fr-container">
                  <div className="fr-grid-row">
                    <BoutonThematique
                      titre="Thématique précédente"
                      reducteur={reducteurBoutonThematiquePrecedente}
                      style="bouton-mac bouton-mac-secondaire"
                      thematiqueCourante={
                        etatReferentiel.thematiqueAffichee || ''
                      }
                      thematiques={thematiques.map(([clef]) => clef)}
                      onClick={(thematique: string) => affiche(thematique)}
                    />
                    <BoutonThematique
                      titre="Thématique suivante"
                      reducteur={reducteurBoutonThematiqueSuivante}
                      style="bouton-mac bouton-mac-primaire"
                      thematiqueCourante={
                        etatReferentiel.thematiqueAffichee || ''
                      }
                      thematiques={thematiques.map(([clef]) => clef)}
                      onClick={(thematique: string) => affiche(thematique)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <FooterDiagnostic />
    </>
  );
};
