import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
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
  ActionReponseDiagnostic,
  Diagnostic,
  Reponse,
  ReponseQuestionATiroir,
} from '../../domaine/diagnostic/Diagnostic.ts';
import '../../assets/styles/_diagnostic.scss';
import '../../assets/styles/_commun.scss';
import { BoutonThematique } from './BoutonThematique.tsx';
import '../../assets/styles/_couleurs.scss';

import {
  reducteurBoutonThematiquePrecedente,
  reducteurBoutonThematiqueSuivante,
} from './reducteurBoutonThematique.ts';
import styled from 'styled-components';
import { FooterDiagnostic } from './FooterDiagnostic.tsx';
import { HeaderDiagnostic } from './HeaderDiagnostic.tsx';
import { useMACAPI, useModale } from '../../fournisseurs/hooks.ts';
import { AccederALaRestitution } from './AccederALaRestitution.tsx';
import { enDiagnostic } from '../../fournisseurs/api/APIDiagnostic.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';

type ProprietesComposantQuestion = {
  actions: ActionReponseDiagnostic[];
  numeroQuestion: number | undefined;
  question: Question;
  reponseDonnee?: ReponseDonnee;
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

type ReponseAEnvoyer = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | ReponseQuestionATiroir | null;
};

const genereParametresAPI = (
  action: ActionReponseDiagnostic,
  reponseDonnee: Reponse,
) => {
  const actionAMener = Object.entries(action).map(([thematique, action]) => ({
    chemin: thematique,
    ressource: action.ressource,
  }))[0];
  const corps: ReponseAEnvoyer = {
    chemin: actionAMener.chemin,
    identifiant: reponseDonnee.identifiantQuestion,
    reponse: reponseDonnee.reponseDonnee,
  };
  return constructeurParametresAPI<ReponseAEnvoyer>()
    .url(actionAMener.ressource.url)
    .methode(actionAMener.ressource.methode)
    .corps(corps)
    .construis();
};

const ComposantQuestionListe = ({
  question,
  actions,
  numeroQuestion,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question, actions),
  );
  const macapi = useMACAPI();

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
        const reponseDonnee = etatReponse.reponse()!;
        const parametresAPI = genereParametresAPI(action, reponseDonnee);
        macapi.appelle<void, ReponseAEnvoyer>(parametresAPI, () =>
          Promise.resolve(),
        );
      }
    }
  }, [actions, etatReponse, macapi, question, reponseQuestionEnvoyee]);

  return (
    <div className={`fr-select-group ${!numeroQuestion ? 'fr-pt-2w' : ''}`}>
      <label className="fr-label" htmlFor={`select-${question.identifiant}`}>
        <h5>
          {numeroQuestion ? `${numeroQuestion}. ` : ''}
          {question.libelle}
        </h5>
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
  numeroQuestion,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question, actions),
  );
  const macapi = useMACAPI();

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
        const parametresAPI = genereParametresAPI(
          action,
          etatReponse.reponse()!,
        );
        macapi
          .appelle<void, ReponseAEnvoyer>(parametresAPI, () =>
            Promise.resolve(),
          )
          .then(() => {
            reponseQuestionEnvoyee();
          });
      }
    }
  }, [actions, etatReponse, macapi, question, reponseQuestionEnvoyee]);
  return (
    <div className={!numeroQuestion ? `fr-pt-2w` : ''}>
      <label className="fr-label">
        <h5>
          {numeroQuestion ? `${numeroQuestion}. ` : ''}
          {question.libelle}
        </h5>
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
    </div>
  );
};

const BoutonNavigueVersThematique = styled.button<{
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
  const { showBoundary } = useErrorBoundary();
  const { affiche, ferme } = useModale();
  const macapi = useMACAPI();

  useEffect(() => {
    if (!etatReferentiel.diagnostic) {
      macapi
        .appelle<Diagnostic>(
          {
            url: `/api/diagnostic/${idDiagnostic}`,
            methode: 'GET',
          },
          enDiagnostic,
        )
        .then((diagnostic) => envoie(diagnosticCharge(diagnostic)))
        .catch((erreur) => showBoundary(erreur));
    }
  }, [idDiagnostic, envoie, showBoundary, macapi, etatReferentiel]);

  let thematiques: [string, Thematique][] = [];
  let actions: Action[] = useMemo(() => [], []);
  if (etatReferentiel.diagnostic?.referentiel !== undefined) {
    thematiques = Object.entries(etatReferentiel.diagnostic!.referentiel!);
    actions = etatReferentiel.diagnostic!.actions;
  }

  const afficheThematique = useCallback(
    (clef: string) => {
      envoie(thematiqueAffichee(clef));
      window.scrollTo({ top: 0 });
    },
    [envoie],
  );

  const afficheModaleAccederALaRestitution = useCallback(
    () =>
      affiche({
        titre: 'Accéder à la restitution',
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
          />
        ),
      }),
    [affiche, ferme, idDiagnostic],
  );

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
            <BoutonNavigueVersThematique
              $localisationIcone={thematique.localisationIconeNavigation}
              className={`fr-btn`}
              onClick={() => afficheThematique(clef)}
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
        quitter={{
          accederALaRestitution: () => afficheModaleAccederALaRestitution(),
        }}
      />
      <main role="main" className="diagnostic-main">
        <div className="fr-grid-row fr-grid-row--gutters fond-clair-mac">
          <div className="conteneur-navigation">{navigation}</div>
          {thematiques.map(([clef, thematique]) => {
            const actionsPossibles: ActionReponseDiagnostic[] = actions.filter(
              (action) => Object.entries(action).find(([c]) => c === clef),
            ) as ActionReponseDiagnostic[];
            const elements = thematique.groupes.flatMap((groupe) => {
              return (
                <fieldset
                  key={`groupe-${groupe.numero}`}
                  id={`groupe-${groupe.numero}`}
                  className="fr-fieldset fr-mb-5w section"
                >
                  {groupe.questions.map((question, index) => {
                    const numeroQuestion =
                      index === 0 ? groupe.numero : undefined;
                    return (
                      <>
                        {question.type === 'liste' ? (
                          <ComposantQuestionListe
                            question={question}
                            actions={actionsPossibles}
                            numeroQuestion={numeroQuestion}
                          />
                        ) : (
                          <ComposantQuestion
                            question={question}
                            actions={actionsPossibles}
                            numeroQuestion={numeroQuestion}
                          />
                        )}
                      </>
                    );
                  })}
                </fieldset>
              );
            });
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
                <div className="bandeau-thematique">
                  <div className="fr-container fr-pt-md-4w">
                    <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
                      <div className="fr-col-7 fr-mt-8w introduction-thematique">
                        <h2>{thematique.libelle}</h2>
                        <p>{thematique.description}</p>
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
                      onClick={(thematique: string) =>
                        afficheThematique(thematique)
                      }
                    />
                    <BoutonThematique
                      titre="Thématique suivante"
                      reducteur={reducteurBoutonThematiqueSuivante}
                      style="bouton-mac bouton-mac-primaire"
                      thematiqueCourante={
                        etatReferentiel.thematiqueAffichee || ''
                      }
                      thematiques={thematiques.map(([clef]) => clef)}
                      onClick={(thematique: string) =>
                        afficheThematique(thematique)
                      }
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
