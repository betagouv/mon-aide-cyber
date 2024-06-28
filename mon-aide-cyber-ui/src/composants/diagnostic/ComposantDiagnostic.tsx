import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import {
  Question,
  ReponseDonnee,
  ReponsePossible,
  Suggestions,
  Thematique,
  TypeDeSaisie,
} from '../../domaine/diagnostic/Referentiel.ts';
import { UUID } from '../../types/Types.ts';
import {
  diagnosticCharge,
  diagnosticModifie,
  reducteurDiagnostic,
  thematiqueAffichee,
} from '../../domaine/diagnostic/reducteurDiagnostic.ts';
import {
  Action,
  actionAMener,
  ActionReponseDiagnostic,
  Reponse,
  reponseMultipleDonnee,
  ReponseQuestionATiroir,
  reponseTiroirMultipleDonnee,
  reponseTiroirUniqueDonnee,
  reponseUniqueDonnee,
} from '../../domaine/diagnostic/Diagnostic.ts';
import '../../assets/styles/_diagnostic.scss';
import '../../assets/styles/_commun.scss';
import { BoutonThematique } from './BoutonThematique.tsx';
import '../../assets/styles/_couleurs.scss';

import {
  reducteurBoutonThematiquePrecedente,
  reducteurBoutonThematiqueSuivante,
} from './reducteurBoutonThematique.ts';
import { FooterDiagnostic } from './FooterDiagnostic.tsx';
import { HeaderDiagnostic } from './HeaderDiagnostic.tsx';
import {
  useMACAPI,
  useModale,
  useNavigationMAC,
} from '../../fournisseurs/hooks.ts';
import { AccederALaRestitution } from './AccederALaRestitution.tsx';
import {
  enDiagnostic,
  RepresentationDiagnostic,
} from '../../fournisseurs/api/APIDiagnostic.ts';

import { constructeurParametresAPI } from '../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { AutoCompletion } from '../auto-completion/AutoCompletion.tsx';
import {
  ConteneurReponsePossible,
  ReponseTiroir,
} from './ConteneurReponsePossible.tsx';
import { TerminerDiagnostic } from './TerminerDiagnostic.tsx';
import { BadgePerimetre } from './BadgePerimetre.tsx';

type ProprietesComposantQuestion = {
  actions: ActionReponseDiagnostic[];
  numeroQuestion: number | undefined;
  question: Question;
  reponseDonnee?: ReponseDonnee;
  surReponse: (reponse: Reponse, action: ActionReponseDiagnostic) => void;
};

type ReponseAEnvoyer = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | ReponseQuestionATiroir | null;
};

const genereParametresAPI = (
  action: ActionReponseDiagnostic,
  reponseDonnee: Reponse
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

const estReponsePossible = (
  reponse: ReponsePossible | string
): reponse is ReponsePossible => {
  const reponsePossible = reponse as ReponsePossible;
  return (
    reponsePossible.identifiant !== null &&
    reponsePossible.identifiant !== undefined &&
    reponsePossible.libelle !== null &&
    reponsePossible.libelle !== undefined
  );
};

const ComposantQuestionListe = ({
  question,
  actions,
  numeroQuestion,
  surReponse,
}: ProprietesComposantQuestion) => {
  const clefsFiltrage: (keyof ReponsePossible)[] =
    question.type === 'liste'
      ? ['libelle']
      : (question.type as Suggestions).clefsFiltrage;
  const champsAAfficher: (keyof ReponsePossible)[] =
    question.type === 'liste'
      ? ['libelle']
      : (question.type as Suggestions).champsAAfficher;

  const surSelection = useCallback(
    (reponse: ReponsePossible) => {
      actionAMener(actions, 'repondre', (action) =>
        surReponse(reponseUniqueDonnee(question, reponse.identifiant), action)
      );
    },
    [actions, question, surReponse]
  );
  const surSaisie = useCallback(
    (reponse: ReponsePossible | string) => {
      if (estReponsePossible(reponse)) {
        actionAMener(actions, 'repondre', (action) =>
          surReponse(reponseUniqueDonnee(question, reponse.identifiant), action)
        );
      }
    },
    [actions, question, surReponse]
  );

  return (
    <div
      className={`fr-select-group ${
        !numeroQuestion ? 'fr-pt-2w' : ''
      } fr-col-12 conteneur-question conteneur-question-liste`}
    >
      <label className="fr-label" htmlFor={`select-${question.identifiant}`}>
        <h5>
          {numeroQuestion ? `${numeroQuestion}. ` : ''}
          {question.libelle}
        </h5>
      </label>
      <AutoCompletion<ReponsePossible>
        nom={`liste-${question.identifiant}`}
        mappeur={(reponse) =>
          typeof reponse === 'string'
            ? reponse
            : champsAAfficher
                .map((champ) => reponse[champ])
                .filter((champ) => !!champ)
                .join(' - ')
        }
        surSelection={(reponse) => surSelection(reponse)}
        surSaisie={(reponse) => surSaisie(reponse)}
        valeurSaisie={
          question.reponsesPossibles.find(
            (rep) => rep.identifiant === question.reponseDonnee.valeur
          ) || ({} as ReponsePossible)
        }
        suggestionsInitiales={question.reponsesPossibles}
        clefsFiltrage={clefsFiltrage}
      />
    </div>
  );
};

const ComposantQuestion = ({
  question,
  actions,
  numeroQuestion,
  surReponse,
}: ProprietesComposantQuestion) => {
  const repondQuestionUnique = useCallback(
    (identifiantReponse: string) => {
      actionAMener(actions, 'repondre', (action) =>
        surReponse(reponseUniqueDonnee(question, identifiantReponse), action)
      );
    },
    [actions, question, surReponse]
  );

  const repondQuestionMultiple = useCallback(
    (reponse: string) => {
      actionAMener(actions, 'repondre', (action) =>
        surReponse(reponseMultipleDonnee(question, reponse), action)
      );
    },
    [actions, question, surReponse]
  );

  const repondQuestionTiroirUnique = useCallback(
    (reponse: ReponseTiroir) => {
      actionAMener(actions, 'repondre', (action) =>
        surReponse(reponseTiroirUniqueDonnee(question, reponse), action)
      );
    },
    [actions, question, surReponse]
  );

  const repondQuestionTiroirMultiple = useCallback(
    (reponse: ReponseTiroir) => {
      actionAMener(actions, 'repondre', (action) =>
        surReponse(reponseTiroirMultipleDonnee(question, reponse), action)
      );
    },
    [actions, question, surReponse]
  );

  const badge = question.perimetre ? (
    <BadgePerimetre perimetre={question.perimetre} />
  ) : (
    <></>
  );

  return (
    <div
      id={question.identifiant}
      className={`${!numeroQuestion ? `fr-pt-2w` : ''} ${question.perimetre ? 'contexte' : ''} conteneur-question`}
    >
      {badge}
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
            <ConteneurReponsePossible
              key={`conteneur-reponse-possible-${reponse.identifiant}`}
              question={question}
              reponse={reponse}
              typeDeSaisie={typeDeSaisie}
              repondQuestionUnique={repondQuestionUnique}
              repondQuestionMultiple={repondQuestionMultiple}
              repondQuestionTiroirMultiple={repondQuestionTiroirMultiple}
              repondQuestionTiroirUnique={repondQuestionTiroirUnique}
            />
          );
        })}
      </div>
    </div>
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
  const { showBoundary } = useErrorBoundary();
  const { affiche, ferme } = useModale();
  const macapi = useMACAPI();
  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    if (!etatReferentiel.diagnostic) {
      macapi
        .appelle<RepresentationDiagnostic>(
          {
            url: `/api/diagnostic/${idDiagnostic}`,
            methode: 'GET',
          },
          enDiagnostic
        )
        .then((reponse) => {
          envoie(diagnosticCharge(reponse.diagnostic));
          navigationMAC.ajouteEtat(reponse.liens);
        })
        .catch((erreur) => showBoundary(erreur));
    }
  }, [
    idDiagnostic,
    envoie,
    showBoundary,
    macapi,
    etatReferentiel,
    navigationMAC,
  ]);

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
    [envoie]
  );

  const afficheModaleAccederALaRestitution = useCallback(
    (titre: string) =>
      affiche({
        titre,
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
          />
        ),
      }),
    [affiche, ferme, idDiagnostic]
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
            <button
              className={`fr-btn ${thematique.styles.navigation}`}
              onClick={() => afficheThematique(clef)}
              title=""
            />
          </li>
        ))}
      </ul>
    </nav>
  );

  const estUneListe = (type: TypeDeSaisie): type is Suggestions | 'liste' => {
    const choixOptions = type as Suggestions;
    return (
      type === 'liste' ||
      (!!choixOptions.champsAAfficher && !!choixOptions.clefsFiltrage)
    );
  };

  const surReponse = useCallback(
    (reponse: Reponse, action: ActionReponseDiagnostic) => {
      const parametresAPI = genereParametresAPI(action, reponse);
      macapi
        .appelle<
          RepresentationDiagnostic,
          ReponseAEnvoyer
        >(parametresAPI, enDiagnostic)
        .then((diagnostic) => {
          envoie(diagnosticModifie(diagnostic.diagnostic));
          navigationMAC.ajouteEtat(diagnostic.liens);
        });
    },
    [macapi, navigationMAC]
  );

  return (
    <>
      <HeaderDiagnostic
        quitter={{
          accederALaRestitution: () =>
            afficheModaleAccederALaRestitution('Accéder à la restitution'),
        }}
      />
      <main role="main" className="diagnostic fond-clair-mac">
        <div className="fr-grid-row fr-col-12">
          <div className="conteneur-navigation">{navigation}</div>
          {thematiques.map(([clef, thematique]) => {
            const actionsPossibles: ActionReponseDiagnostic[] = actions.filter(
              (action) => Object.entries(action).find(([c]) => c === clef)
            ) as ActionReponseDiagnostic[];
            const questionsGroupees = thematique.groupes.flatMap((groupe) => {
              return (
                <div className="fr-grid-row fr-grid-row--gutters">
                  <div className="fr-col-md-8 fr-col-8">
                    <fieldset
                      key={`groupe-${groupe.numero}`}
                      id={`groupe-${groupe.numero}`}
                      className="fr-fieldset section"
                    >
                      {groupe.questions.map((question, index) => {
                        const numeroQuestion =
                          index === 0 ? groupe.numero : undefined;
                        return (
                          <>
                            {estUneListe(question.type) ? (
                              <ComposantQuestionListe
                                question={question}
                                actions={actionsPossibles}
                                numeroQuestion={numeroQuestion}
                                surReponse={surReponse}
                              />
                            ) : (
                              <ComposantQuestion
                                question={question}
                                actions={actionsPossibles}
                                numeroQuestion={numeroQuestion}
                                surReponse={surReponse}
                              />
                            )}
                          </>
                        );
                      })}
                    </fieldset>
                  </div>
                  <div className="fr-col-md-4 fr-col-4">
                    {groupe.questions.map((question) =>
                      question['info-bulles']?.map((infoBulle) => (
                        <div
                          key={`${question.identifiant}-conteneur-info-bulle`}
                        >
                          <div
                            className="info-bulle"
                            key={`${question.identifiant}-info-bulle`}
                            dangerouslySetInnerHTML={{
                              __html: infoBulle,
                            }}
                          ></div>
                          <div className="bordure-info-bulle"></div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
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
               conteneur-thematique fr-col-12`}
              >
                <div className="bandeau-thematique">
                  <div className="fr-container fr-pt-md-4w">
                    <div className="fr-grid-row fr-grid-row--center fr-grid-row--gutters">
                      <div className="fr-col-6 fr-mt-8w introduction-thematique">
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
                    <form id={clef}>
                      <section className="question">
                        {questionsGroupees}
                      </section>
                    </form>
                    <div className="fr-col-md-4 fr-col-4"></div>
                  </div>
                </div>
                <div className="fr-container">
                  <div className="fr-grid-row fr-grid-row--gutters fr-mt-5w boutons-navigation">
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
                    <TerminerDiagnostic
                      style="bouton-mac bouton-mac-primaire"
                      thematiqueCourante={
                        etatReferentiel.thematiqueAffichee || ''
                      }
                      thematiques={thematiques.map(([clef]) => clef)}
                      onClick={() =>
                        afficheModaleAccederALaRestitution(
                          'Terminer le diagnostic'
                        )
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
