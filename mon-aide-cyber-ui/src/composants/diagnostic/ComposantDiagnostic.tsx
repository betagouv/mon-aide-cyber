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
import Button from '@codegouvfr/react-dsfr/Button';
import { RiIconClassName } from '@codegouvfr/react-dsfr/src/fr/generatedFromCss/classNames.ts';
import Select from '@codegouvfr/react-dsfr/Select';
import { BoutonThematique } from './BoutonThematique.tsx';

import {
  reducteurBoutonThematiquePrecedente,
  reducteurBoutonThematiqueSuivante,
} from './reducteurBoutonThematique.ts';

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
    <div className={`fr-${proprietes.typeDeSaisie}-group`}>
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
    <Select
      label={question.libelle}
      id={question.identifiant}
      nativeSelectProps={{
        onChange: (event) => repond(event),
        value: etatReponse.valeur(),
      }}
    >
      <option value="" disabled hidden selected>
        Sélectionnez une option
      </option>
      {question.reponsesPossibles.map((reponse) => {
        return (
          <option key={reponse.identifiant} value={reponse.identifiant}>
            {reponse.libelle}
          </option>
        );
      })}
    </Select>
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
      <legend className="fr-fieldset__legend">{question.libelle}</legend>
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

  const icones: RiIconClassName[] = [
    'ri-building-line',
    'ri-user-2-line',
    'ri-key-2-line',
    'ri-computer-line',
    'ri-server-line',
    'ri-team-line',
    'ri-loop-right-line',
  ];

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
    <nav className="fr-sidemenu fr-sidemenu--sticky-full-height">
      <div className="fr-sidemenu__inner">
        <button
          className="fr-sidemenu__btn"
          hidden
          aria-controls="fr-sidemenu-wrapper"
          aria-expanded="false"
        >
          Thématiques
        </button>
        <div className="fr-collapse" id="fr-sidemenu-wrapper">
          <ul className="fr-sidemenu__list">
            {thematiques.map(([clef], index) => (
              <li
                key={`li-${clef}`}
                className={
                  'fr-sidemenu__item' +
                  (etatReferentiel.thematiqueAffichee === clef
                    ? ' fr-sidemenu__item--active'
                    : '')
                }
              >
                <Button
                  iconId={icones[index]}
                  priority={
                    etatReferentiel.thematiqueAffichee === clef
                      ? 'primary'
                      : 'secondary'
                  }
                  onClick={() => affiche(clef)}
                  title=""
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-1">{navigation}</div>
        <div className="fr-col-12 fr-col-md-8 fr-py-12v fr-col-offset-3--right">
          {boutonDesactive && spinner}
          {lienCopie}
          <div className="fr-col-offset-6 fr-col-offset-md-8 fr-grid-row">
            <div>
              <Button
                className="bouton-mac bouton-mac-primaire"
                disabled={boutonDesactive}
                onClick={() => termineDiagnostic()}
              >
                Terminer Diagnostic
              </Button>
            </div>
            <div className="fr-share fr-ml-1w">
              <ul className="fr-share__group">
                <li>
                  <button
                    className="bouton-icone-mac bouton-mac-secondaire fr-share__link fr-share__link--copy"
                    title="Copier le lien du diagnostic"
                    onClick={copierLienDiagnostic}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-8">
            {thematiques.map(([clef, thematique]) => {
              const actionsPossibles: ActionReponseDiagnostic[] =
                actions.filter((action) =>
                  Object.entries(action).find(([c]) => c === clef),
                ) as ActionReponseDiagnostic[];
              const elements = thematique.questions.map((question) => (
                <fieldset
                  key={question.identifiant}
                  id={question.identifiant}
                  className="fr-fieldset fr-mb-5w"
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
                <form
                  key={clef}
                  id={clef}
                  className={
                    etatReferentiel.thematiqueAffichee === clef
                      ? `visible`
                      : `invisible`
                  }
                >
                  <h2>{clef}</h2>
                  <section className="question">
                    <div>{elements}</div>
                  </section>
                </form>
              );
            })}
          </div>
          <div>
            <BoutonThematique
              titre="Thématique précédente"
              reducteur={reducteurBoutonThematiquePrecedente}
              style="bouton-mac bouton-mac-secondaire"
              thematiqueCourante={etatReferentiel.thematiqueAffichee || ''}
              thematiques={thematiques.map(([clef]) => clef)}
              onClick={(thematique: string) => affiche(thematique)}
            />
            <BoutonThematique
              titre="Thématique suivante"
              reducteur={reducteurBoutonThematiqueSuivante}
              style="bouton-mac bouton-mac-primaire"
              thematiqueCourante={etatReferentiel.thematiqueAffichee || ''}
              thematiques={thematiques.map(([clef]) => clef)}
              onClick={(thematique: string) => affiche(thematique)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
