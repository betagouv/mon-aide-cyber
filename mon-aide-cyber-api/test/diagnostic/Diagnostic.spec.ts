import { describe, expect } from 'vitest';
import {
  unTableauDeRecommandations,
  unTableauDeRecommandationsPour7Questions,
} from '../constructeurs/constructeurTableauDeRecommandations';
import {
  unDiagnostic,
  uneReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import {
  uneListeDe7QuestionsToutesAssociees,
  uneListeDeQuestions,
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import {
  genereLesRecommandations,
  Indicateurs,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { uneAssociation } from '../constructeurs/constructeurAssociation';

describe('Diagnostic', () => {
  type PartieCommuneAttendueRecommandationPriorisee = Omit<
    RecommandationPriorisee,
    'priorisation' | 'titre'
  >;

  const PARTIE_COMMUNE_ATTENDUE: PartieCommuneAttendueRecommandationPriorisee =
    {
      valeurObtenue: { theorique: 0 },
      pourquoi: 'parce-que',
      comment: 'comme ça',
    };

  const tableauDeRecommandations = unTableauDeRecommandationsPour7Questions();

  const questions = uneListeDe7QuestionsToutesAssociees();

  describe('restitution', () => {
    describe("lorsque l'on génère les recommandations", () => {
      describe('en ce qui concerne les différents niveaux de recommandations', () => {
        it('prend en compte la valeur de la réponse pour choisir entre le niveau 1 ou le niveau 2 des recommandations', () => {
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .sansThematique()
                .ajouteUneThematique('thematique', questions)
                .construis(),
            )
            .avecLesReponsesDonnees('thematique', [
              { q1: 'reponse-11' },
              { q2: 'reponse-22' },
              { q3: 'reponse-31' },
              { q4: 'reponse-41' },
              { q5: 'reponse-52' },
              { q6: 'reponse-61' },
              { q7: 'reponse-72' },
            ])
            .avecUnTableauDeRecommandations(tableauDeRecommandations)
            .construis();

          genereLesRecommandations(diagnostic);

          expect(
            diagnostic.restitution?.recommandations
              ?.recommandationsPrioritaires,
          ).toStrictEqual<RecommandationPriorisee[]>([
            {
              priorisation: 1,
              titre: 'reco 1',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 3,
              titre: 'reco 3',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 4,
              titre: 'reco 4',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 6,
              titre: 'reco 6',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 2,
              titre: 'reco 22',

              ...PARTIE_COMMUNE_ATTENDUE,
              valeurObtenue: { theorique: 1 },
            },
            {
              priorisation: 5,
              titre: 'reco 52',
              ...PARTIE_COMMUNE_ATTENDUE,
              valeurObtenue: { theorique: 1 },
            },
          ]);
          expect(
            diagnostic.restitution?.recommandations?.autresRecommandations,
          ).toStrictEqual<RecommandationPriorisee[]>([
            {
              priorisation: 7,
              titre: 'reco 72',
              ...PARTIE_COMMUNE_ATTENDUE,
              valeurObtenue: { theorique: 1 },
            },
          ]);
        });

        it('le niveau 2 est optionnel', () => {
          const tableauDeRecommandations =
            unTableauDeRecommandations().avecLesRecommandations([
              { q8: { niveau1: 'reco 8', priorisation: 7 } },
            ]);
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .sansThematique()
                .ajouteUneThematique('thematique', [
                  uneQuestion()
                    .aChoixUnique('q8')
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .avecLibelle('Réponse 81')
                        .associeeARecommandation('q8', 1, 0)
                        .construis(),
                      uneReponsePossible()
                        .avecLibelle('Réponse 82')
                        .associeeARecommandation('q8', 1, 1)
                        .construis(),
                      uneReponsePossible()
                        .avecLibelle('Réponse 83')
                        .construis(),
                    ])
                    .construis(),
                ])
                .construis(),
            )
            .avecLesReponsesDonnees('thematique', [{ q8: 'reponse-82' }])
            .avecUnTableauDeRecommandations(
              tableauDeRecommandations.construis(),
            )
            .construis();

          genereLesRecommandations(diagnostic);

          expect(
            diagnostic.restitution?.recommandations
              ?.recommandationsPrioritaires,
          ).toStrictEqual<RecommandationPriorisee[]>([
            {
              comment: 'comme ça',
              valeurObtenue: { theorique: 1 },
              pourquoi: 'parce-que',
              priorisation: 7,
              titre: 'reco 8',
            },
          ]);
        });
      });

      it('prend en compte les questions ne donnant pas lieu à une recommandation', () => {
        const questionContexte = uneQuestion()
          .aChoixUnique('qc')
          .avecReponsesPossibles([
            uneReponsePossible().avecLibelle('qc').construis(),
          ])
          .construis();
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique('thematique', questions)
              .ajouteUneQuestionAuContexte(questionContexte)
              .construis(),
          )
          .avecLesReponsesDonnees('contexte', [{ qc: 'rqc' }])
          .avecLesReponsesDonnees('thematique', [
            { q1: 'reponse-13' },
            { q2: 'reponse-22' },
            { q3: 'reponse-31' },
            { q4: 'reponse-44' },
            { q5: 'reponse-52' },
            { q6: 'reponse-61' },
            { q7: 'reponse-72' },
          ])
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.restitution?.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual<RecommandationPriorisee[]>([
          {
            ...PARTIE_COMMUNE_ATTENDUE,
            priorisation: 3,
            titre: 'reco 3',
          },
          {
            ...PARTIE_COMMUNE_ATTENDUE,
            priorisation: 6,
            titre: 'reco 6',
          },
          {
            ...PARTIE_COMMUNE_ATTENDUE,
            priorisation: 2,
            titre: 'reco 22',
            valeurObtenue: { theorique: 1 },
          },
          {
            ...PARTIE_COMMUNE_ATTENDUE,
            priorisation: 5,
            titre: 'reco 52',
            valeurObtenue: { theorique: 1 },
          },
          {
            ...PARTIE_COMMUNE_ATTENDUE,
            priorisation: 7,
            titre: 'reco 72',
            valeurObtenue: { theorique: 1 },
          },
        ]);
        expect(
          diagnostic.restitution?.recommandations?.autresRecommandations,
        ).toStrictEqual([]);
      });

      describe('trie le resultat', () => {
        const tableauDeRecommandations = unTableauDeRecommandations()
          .avecLesRecommandations([
            { q1: { niveau1: 'reco 1', niveau2: 'reco 12', priorisation: 3 } },
            { q2: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
            { q3: { niveau1: 'reco 3', niveau2: 'reco 32', priorisation: 4 } },
            { q4: { niveau1: 'reco 4', niveau2: 'reco 42', priorisation: 1 } },
            { q5: { niveau1: 'reco 5', niveau2: 'reco 52', priorisation: 7 } },
            { q6: { niveau1: 'reco 6', niveau2: 'reco 62', priorisation: 5 } },
            { q7: { niveau1: 'reco 7', niveau2: 'reco 72', priorisation: 6 } },
            { q8: { niveau1: 'reco 8', niveau2: 'reco 82', priorisation: 8 } },
            { q9: { niveau1: 'reco 9', niveau2: 'reco 92', priorisation: 9 } },
          ])
          .construis();

        it('en prenant en compte le niveau de priorisation de la recommandation', () => {
          const questionsSupplementaires = uneListeDeQuestions()
            .dontLesLabelsSont(['q8', 'q9'])
            .avecLesReponsesPossiblesSuivantesAssociees([
              {
                libelle: 'reponse 81',
                association: uneAssociation()
                  .avecIdentifiant('q8')
                  .deNiveau1()
                  .ayantPourValeurTheorique(0)
                  .construis(),
              },
              {
                libelle: 'reponse 82',
                association: uneAssociation()
                  .avecIdentifiant('q8')
                  .deNiveau2()
                  .ayantPourValeurTheorique(1)
                  .construis(),
              },
              {
                libelle: 'reponse 91',
                association: uneAssociation()
                  .avecIdentifiant('q9')
                  .deNiveau1()
                  .ayantPourValeurTheorique(0)
                  .construis(),
              },
              {
                libelle: 'reponse 92',
                association: uneAssociation()
                  .avecIdentifiant('q9')
                  .deNiveau2()
                  .ayantPourValeurTheorique(1)
                  .construis(),
              },
            ])
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneThematique('thematique', [
                  ...questions,
                  ...questionsSupplementaires,
                ])
                .construis(),
            )
            .avecLesReponsesDonnees('contexte', [{ qc: 'rqc' }])
            .avecLesReponsesDonnees('thematique', [
              { q2: 'reponse-23' },
              { q1: 'reponse-11' },
              { q4: 'reponse-41' },
              { q3: 'reponse-34' },
              { q6: 'reponse-61' },
              { q5: 'reponse-52' },
              { q7: 'reponse-71' },
              { q8: 'reponse-81' },
              { q9: 'reponse-92' },
            ])
            .avecUnTableauDeRecommandations(tableauDeRecommandations)
            .construis();

          genereLesRecommandations(diagnostic);

          expect(
            diagnostic.restitution?.recommandations
              ?.recommandationsPrioritaires,
          ).toStrictEqual<RecommandationPriorisee[]>([
            {
              priorisation: 1,
              titre: 'reco 4',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 3,
              titre: 'reco 1',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 5,
              titre: 'reco 6',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              priorisation: 6,
              titre: 'reco 7',
              ...PARTIE_COMMUNE_ATTENDUE,
            },
            {
              ...PARTIE_COMMUNE_ATTENDUE,
              priorisation: 8,
              titre: 'reco 8',
            },
            {
              ...PARTIE_COMMUNE_ATTENDUE,
              valeurObtenue: { theorique: 1 },
              priorisation: 7,
              titre: 'reco 52',
            },
          ]);
          expect(
            diagnostic.restitution?.recommandations?.autresRecommandations,
          ).toStrictEqual<RecommandationPriorisee[]>([
            {
              ...PARTIE_COMMUNE_ATTENDUE,
              valeurObtenue: { theorique: 1 },
              priorisation: 9,
              titre: 'reco 92',
            },
          ]);
        });
      });

      describe("pour des questions dont le résultat dépend d'une règle de calcul", () => {
        const tableauDeRecommandations = unTableauDeRecommandations()
          .avecLesRecommandations([
            { q1: { niveau1: 'reco 1', niveau2: 'reco 12', priorisation: 1 } },
          ])
          .construis();
        const question = uneQuestion()
          .aChoixUnique('q1')
          .avecReponsesPossibles([
            uneReponsePossible().avecLibelle('Réponse 1').construis(),
            uneReponsePossible().avecLibelle('Réponse 2').construis(),
            uneReponsePossible()
              .avecLibelle('Réponse 3')
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique('Question 31')
                  .avecReponsesPossibles([
                    uneReponsePossible().avecLibelle('Réponse 311').construis(),
                    uneReponsePossible().avecLibelle('Réponse 312').construis(),
                  ])
                  .construis(),
              )
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique('Question 32')
                  .avecReponsesPossibles([
                    uneReponsePossible().avecLibelle('Réponse 321').construis(),
                    uneReponsePossible().avecLibelle('Réponse 322').construis(),
                  ])
                  .construis(),
              )
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique('Réponse 33')
                  .avecReponsesPossibles([
                    uneReponsePossible().avecLibelle('Réponse 331').construis(),
                    uneReponsePossible().avecLibelle('Réponse 332').construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .construis();

        it('prend en compte les réponses aux questions ne donnant pas lieu à une recommandation', () => {
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .sansThematique()
                .ajouteUneThematique('multiple', [question])
                .construis(),
            )
            .ajouteUneReponseDonnee(
              { thematique: 'multiple', question: 'q1' },
              uneReponseDonnee()
                .ayantPourReponse('reponse-3')
                .avecDesReponsesMultiples([
                  {
                    identifiant: 'question-31',
                    reponses: ['reponse-310'],
                  },
                  {
                    identifiant: 'question-32',
                    reponses: ['reponse-320'],
                  },
                  {
                    identifiant: 'question-33',
                    reponses: ['reponse-330'],
                  },
                ])
                .construis(),
            )
            .avecUnTableauDeRecommandations(tableauDeRecommandations)
            .construis();

          genereLesRecommandations(diagnostic);

          expect(
            diagnostic.restitution?.recommandations
              ?.recommandationsPrioritaires,
          ).toStrictEqual([]);
          expect(
            diagnostic.restitution?.recommandations?.autresRecommandations,
          ).toStrictEqual([]);
        });
      });
    });

    describe('calcul les indicateurs', () => {
      const questionsThematique1 = uneListeDeQuestions()
        .dontLesLabelsSont(['q1', 'q2'])
        .avecLesReponsesPossiblesSuivantesAssociees([
          {
            libelle: 'reponse 1',
            association: uneAssociation()
              .avecIdentifiant('q1')
              .deNiveau1()
              .ayantPourValeurTheorique(2)
              .construis(),
          },
          {
            libelle: 'reponse 2',
            association: uneAssociation()
              .avecIdentifiant('q2')
              .deNiveau2()
              .ayantPourValeurTheorique(2)
              .construis(),
          },
        ])
        .construis();
      const questionsThematique2 = uneListeDeQuestions()
        .dontLesLabelsSont(['q1', 'q2'])
        .avecLesReponsesPossiblesSuivantesAssociees([
          {
            libelle: 'reponse 1',
            association: uneAssociation()
              .avecIdentifiant('q1')
              .deNiveau1()
              .ayantPourValeurTheorique(3)
              .construis(),
          },
          {
            libelle: 'reponse 2',
            association: uneAssociation()
              .avecIdentifiant('q2')
              .deNiveau2()
              .ayantPourValeurTheorique(3)
              .construis(),
          },
        ])
        .construis();

      it('en donnant la moyenne par thématiques', () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique('thematique1', questionsThematique1)
              .ajouteUneThematique('thematique2', questionsThematique2)
              .construis(),
          )
          .avecLesReponsesDonnees('thematique1', [
            { q2: 'reponse-1' },
            { q1: 'reponse-2' },
          ])
          .avecLesReponsesDonnees('thematique2', [
            { q2: 'reponse-1' },
            { q1: 'reponse-2' },
          ])
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        expect(diagnostic.restitution?.indicateurs).toStrictEqual<Indicateurs>({
          thematique1: { moyennePonderee: 2 },
          thematique2: { moyennePonderee: 3 },
        });
      });

      it('ne prend pas en compte les thématiques sans recommandations', () => {
        const questionContexte = uneQuestion()
          .aChoixUnique('qc')
          .avecReponsesPossibles([
            uneReponsePossible().avecLibelle('qc').construis(),
          ])
          .construis();
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneQuestionAuContexte(questionContexte)
              .ajouteUneThematique('thematique1', questionsThematique1)
              .construis(),
          )
          .avecLesReponsesDonnees('thematique1', [
            { q2: 'reponse-1' },
            { q1: 'reponse-2' },
          ])
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);
        expect(diagnostic.restitution?.indicateurs).toStrictEqual<Indicateurs>({
          thematique1: { moyennePonderee: 2 },
        });
      });

      it('ne prend pas en compte les thématiques sans recommandations contenant des questions à tiroir', () => {
        const questionContexte = uneQuestion()
          .aChoixUnique('qc')
          .avecReponsesPossibles([
            uneReponsePossible()
              .avecLibelle('qc')
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .avecReponsesPossibles([uneReponsePossible().construis()])
                  .construis(),
              )
              .construis(),
          ])
          .construis();
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneQuestionAuContexte(questionContexte)
              .ajouteUneThematique('thematique1', questionsThematique1)
              .construis(),
          )
          .avecLesReponsesDonnees('thematique1', [
            { q2: 'reponse-1' },
            { q1: 'reponse-2' },
          ])
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);
        expect(diagnostic.restitution?.indicateurs).toStrictEqual<Indicateurs>({
          thematique1: { moyennePonderee: 2 },
        });
      });
    });
  });
});
