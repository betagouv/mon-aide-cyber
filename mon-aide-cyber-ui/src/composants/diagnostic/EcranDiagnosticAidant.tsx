import { ReactElement, useCallback, useEffect, useReducer } from 'react';
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
import { useModale, useNavigationMAC } from '../../fournisseurs/hooks.ts';
import { AccederALaRestitution } from './AccederALaRestitution.tsx';
import {
  enDiagnostic,
  ReponseDiagnostic,
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
import {
  MoteurDeLiens,
  ROUTE_MON_ESPACE,
} from '../../domaine/MoteurDeLiens.ts';
import { MACAPIType, useMACAPI } from '../../fournisseurs/api/useMACAPI.ts';
import { Lien } from '../../domaine/Lien.ts';
import { useRecupereContexteNavigation } from '../../hooks/useRecupereContexteNavigation.ts';
import Button from '../atomes/Button/Button.tsx';
import { useTitreDePage } from '../../hooks/useTitreDePage.ts';

type ProprietesComposantQuestion = {
  thematique: string;
  numeroQuestion: number | undefined;
  question: Question;
  reponseDonnee?: ReponseDonnee;
  surReponse: (reponse: Reponse, thematique: string) => void;
};

type ReponseAEnvoyer = {
  chemin: string;
  identifiant: string;
  reponse: string | string[] | ReponseQuestionATiroir | null;
};

const genereParametresAPI = (
  thematique: string,
  lien: Lien,
  reponseDonnee: Reponse
) => {
  const corps: ReponseAEnvoyer = {
    chemin: thematique,
    identifiant: reponseDonnee.identifiantQuestion,
    reponse: reponseDonnee.reponseDonnee,
  };
  return constructeurParametresAPI<ReponseAEnvoyer>()
    .url(lien.url)
    .methode(lien.methode!)
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
  thematique,
  question,
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
      surReponse(
        reponseUniqueDonnee(question, reponse.identifiant),
        thematique
      );
    },
    [question, surReponse]
  );
  const surSaisie = useCallback(
    (reponse: ReponsePossible | string) => {
      if (estReponsePossible(reponse)) {
        surReponse(
          reponseUniqueDonnee(question, reponse.identifiant),
          thematique
        );
      }
    },
    [question, surReponse]
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
  thematique,
  question,
  numeroQuestion,
  surReponse,
}: ProprietesComposantQuestion) => {
  const repondQuestionUnique = useCallback(
    (identifiantReponse: string) => {
      surReponse(reponseUniqueDonnee(question, identifiantReponse), thematique);
    },
    [question, surReponse]
  );

  const repondQuestionMultiple = useCallback(
    (reponse: string) => {
      surReponse(reponseMultipleDonnee(question, reponse), thematique);
    },
    [question, surReponse]
  );

  const repondQuestionTiroirUnique = useCallback(
    (reponse: ReponseTiroir) => {
      surReponse(reponseTiroirUniqueDonnee(question, reponse), thematique);
    },
    [question, surReponse]
  );

  const repondQuestionTiroirMultiple = useCallback(
    (reponse: ReponseTiroir) => {
      surReponse(reponseTiroirMultipleDonnee(question, reponse), thematique);
    },
    [question, surReponse]
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

type ProprietesEcranDiagnostic = {
  idDiagnostic: UUID;
};

type ProprietesComposantDiagnostic = {
  idDiagnostic: UUID;
  macAPI: MACAPIType;
  header: ReactElement;
  accedeALaRestitution: (titre: string) => void;
};

export const EcranDiagnostic = ({
  idDiagnostic,
  macAPI,
  accedeALaRestitution,
  header,
}: ProprietesComposantDiagnostic) => {
  const [etatReferentiel, envoie] = useReducer(reducteurDiagnostic, {
    diagnostic: undefined,
    thematiqueAffichee: undefined,
  });
  const { showBoundary } = useErrorBoundary();
  const navigationMAC = useNavigationMAC();

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'modifier-diagnostic',
      (lien) => {
        if (!etatReferentiel.diagnostic) {
          macAPI
            .execute<RepresentationDiagnostic, ReponseDiagnostic>(
              {
                url: lien.url,
                methode: lien.methode!,
              },
              enDiagnostic
            )
            .then((reponse) => {
              envoie(diagnosticCharge(reponse.diagnostic));
              navigationMAC.ajouteEtat(reponse.liens);
            })
            .catch((erreur) => showBoundary(erreur));
        }
      }
    );
  }, [idDiagnostic, envoie, showBoundary, etatReferentiel, navigationMAC.etat]);

  let thematiques: [string, Thematique][] = [];
  if (etatReferentiel.diagnostic?.referentiel !== undefined) {
    thematiques = Object.entries(etatReferentiel.diagnostic!.referentiel!);
  }

  const afficheThematique = useCallback(
    (clef: string) => {
      envoie(thematiqueAffichee(clef));
      window.scrollTo({ top: 0 });
    },
    [envoie]
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
    (reponse: Reponse, thematique: string) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'repondre-diagnostic',
        (lien) => {
          const parametresAPI = genereParametresAPI(thematique, lien, reponse);
          macAPI
            .execute<
              RepresentationDiagnostic,
              ReponseDiagnostic,
              ReponseAEnvoyer
            >(parametresAPI, enDiagnostic)
            .then((diagnostic) => {
              envoie(diagnosticModifie(diagnostic.diagnostic));
              navigationMAC.ajouteEtat(diagnostic.liens);
            });
        }
      );
    },
    [navigationMAC]
  );

  return (
    <>
      {header}
      <main role="main" className="diagnostic fond-clair-mac">
        <div className="fr-grid-row fr-col-12">
          <div className="conteneur-navigation">{navigation}</div>
          {thematiques.map(([clef, thematique]) => {
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
                                thematique={clef}
                                question={question}
                                numeroQuestion={numeroQuestion}
                                surReponse={surReponse}
                              />
                            ) : (
                              <ComposantQuestion
                                thematique={clef}
                                question={question}
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
                        accedeALaRestitution('Terminer le diagnostic')
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

export const ActionsHeaderDiagnosticAidant = ({
  idDiagnostic,
}: {
  idDiagnostic: UUID;
}) => {
  const { affiche, ferme } = useModale();

  const quitterDiagnostic = () => {
    affiche({
      titre: 'Quitter le diagnostic',
      corps: (
        <section>
          <p>
            Vous vous apprêtez à quitter le diagnostic et à revenir à votre
            espace. Votre progression est enregistrée, vous pourrez reprendre et
            modifier le diagnostic ultérieurement.
          </p>
          <div className="fr-pt-4w">
            <Button
              type="button"
              variant="secondary"
              key="annule-acceder-a-la-restitution"
              className="fr-mr-2w"
              onClick={ferme}
            >
              Annuler
            </Button>
            <Button
              type="button"
              key="connexion-aidant"
              onClick={() => {
                window.location.replace(`${ROUTE_MON_ESPACE}/tableau-de-bord`);
              }}
            >
              Quitter le diagnostic
            </Button>
          </div>
        </section>
      ),
    });
  };
  const afficheModaleAccederALaRestitution = useCallback(
    (titre: string) =>
      affiche({
        titre,
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
            route={`${ROUTE_MON_ESPACE}/diagnostic`}
          />
        ),
      }),
    [affiche, ferme, idDiagnostic]
  );

  return (
    <>
      <Button type="button" variant="secondary" onClick={quitterDiagnostic}>
        <span>Quitter</span>
      </Button>
      <Button
        title="Accéder à la restitution"
        onClick={() =>
          afficheModaleAccederALaRestitution('Accéder à la restitution')
        }
      >
        <span>Accéder à la restitution</span>
      </Button>
    </>
  );
};
export const ActionsHeaderDiagnosticLibreAcces = ({
  idDiagnostic,
}: {
  idDiagnostic: UUID;
}) => {
  const { affiche, ferme } = useModale();

  const quitterDiagnostic = () => {
    affiche({
      titre: 'Quitter le diagnostic',
      corps: (
        <section>
          <p>
            Vous vous apprêtez à quitter le diagnostic en cours, votre
            progression sera perdue.
            <br />
            <br />
            Si vous préférez solliciter une aide pour répondre aux questions,
            vous pouvez{' '}
            <a href="/beneficier-du-dispositif/etre-aide#formulaire-demande-aide">
              faire une demande pour un diagnostic accompagné
            </a>
            .
          </p>
          <div className="fr-pt-4w">
            <Button
              type="button"
              variant="secondary"
              key="annule-acceder-a-la-restitution"
              className="fr-mr-2w"
              onClick={ferme}
            >
              Annuler
            </Button>
            <Button
              type="button"
              key="connexion-aidant"
              onClick={() => {
                window.location.replace('/beneficier-du-dispositif/etre-aide');
              }}
            >
              Quitter le diagnostic
            </Button>
          </div>
        </section>
      ),
    });
  };

  const afficheModaleAccederALaRestitution = useCallback(
    (titre: string) =>
      affiche({
        titre,
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
            route="/diagnostic"
          />
        ),
      }),
    [affiche, ferme, idDiagnostic]
  );

  return (
    <>
      <Button type="button" variant="secondary" onClick={quitterDiagnostic}>
        <span>Quitter</span>
      </Button>
      <Button
        title="Accéder à la restitution"
        onClick={() =>
          afficheModaleAccederALaRestitution('Quitter le diagnostic')
        }
      >
        <span>Accéder à la restitution</span>
      </Button>
    </>
  );
};

export const EcranDiagnosticAidant = ({
  idDiagnostic,
}: ProprietesEcranDiagnostic) => {
  const { affiche, ferme } = useModale();

  const afficheModaleAccederALaRestitution = useCallback(
    (titre: string) =>
      affiche({
        titre,
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
            route={`${ROUTE_MON_ESPACE}/diagnostic`}
          />
        ),
      }),
    [affiche, ferme, idDiagnostic]
  );

  return (
    <EcranDiagnostic
      idDiagnostic={idDiagnostic}
      macAPI={useMACAPI()}
      header={
        <HeaderDiagnostic
          actions={
            <ActionsHeaderDiagnosticAidant idDiagnostic={idDiagnostic} />
          }
        />
      }
      accedeALaRestitution={afficheModaleAccederALaRestitution}
    />
  );
};

export const EcranDiagnosticLibreAcces = ({
  idDiagnostic,
}: ProprietesEcranDiagnostic) => {
  useTitreDePage('Diagnostic');

  const { affiche, ferme } = useModale();

  useRecupereContexteNavigation(
    `utiliser-outil-diagnostic:afficher:${idDiagnostic}`
  );

  const afficheModaleAccederALaRestitution = useCallback(
    (titre: string) =>
      affiche({
        titre,
        corps: (
          <AccederALaRestitution
            surAnnuler={ferme}
            idDiagnostic={idDiagnostic}
            route="/diagnostic"
          />
        ),
      }),
    [affiche, ferme, idDiagnostic]
  );

  return (
    <EcranDiagnostic
      idDiagnostic={idDiagnostic}
      macAPI={useMACAPI()}
      header={
        <HeaderDiagnostic
          actions={
            <ActionsHeaderDiagnosticLibreAcces idDiagnostic={idDiagnostic} />
          }
        />
      }
      accedeALaRestitution={afficheModaleAccederALaRestitution}
    />
  );
};
