import { describe, expect } from 'vitest';
import { unTableauDeRecommandations } from '../constructeurs/constructeurTableauDeRecommandations';
import {
  unDiagnostic,
  uneReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import {
  uneListeDeQuestions,
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';
import {
  ajouteLaReponseAuDiagnostic,
  genereLesRecommandations,
  ReponseLibre,
} from '../../src/diagnostic/Diagnostic';

describe('Diagnostic', () => {
  const tableauDeRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      { q1: { niveau1: 'reco 1', niveau2: 'reco 12', priorisation: 1 } },
      { q2: { niveau1: 'reco 2', niveau2: 'reco 22', priorisation: 2 } },
      { q3: { niveau1: 'reco 3', niveau2: 'reco 32', priorisation: 3 } },
      { q4: { niveau1: 'reco 4', niveau2: 'reco 42', priorisation: 4 } },
      { q5: { niveau1: 'reco 5', niveau2: 'reco 52', priorisation: 5 } },
      { q6: { niveau1: 'reco 6', niveau2: 'reco 62', priorisation: 6 } },
      { q7: { niveau1: 'reco 7', niveau2: 'reco 72', priorisation: 7 } },
    ])
    .construis();

  describe("lorsque l'on donne une réponse", () => {
    it('la saisie libre est acceptée', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('saisie-libre', [
              uneQuestion()
                .aChoixUnique('Question ouverte')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('À préciser').construis(),
                ])
                .construis(),
            ])
            .construis(),
        )
        .construis();

      ajouteLaReponseAuDiagnostic(diagnostic, {
        chemin: 'saisie-libre',
        identifiant: 'question-ouverte',
        reponse: {
          identifiant: 'a-preciser',
          valeur: 'La réponse à la question',
        },
      });

      expect(
        diagnostic.referentiel['saisie-libre'].questions[0].reponseDonnee
          .reponseUnique,
      ).toStrictEqual<ReponseLibre>({
        identifiant: 'a-preciser',
        reponse: 'La réponse à la question',
      });
    });
  });

  describe("lorsque l'on génère les recommandations", () => {
    const questions = uneListeDeQuestions()
      .dontLesLabelsSont(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'])
      .avecLesReponsesPossiblesSuivantesAssociees([
        {
          libelle: 'reponse 11',
          association: {
            identifiantRecommandation: 'q1',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 12',
          association: {
            identifiantRecommandation: 'q1',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 13' },
        { libelle: 'reponse 14' },
        {
          libelle: 'reponse 21',
          association: {
            identifiantRecommandation: 'q2',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 22',
          association: {
            identifiantRecommandation: 'q2',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 23' },
        { libelle: 'reponse 24' },
        {
          libelle: 'reponse 31',
          association: {
            identifiantRecommandation: 'q3',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 32',
          association: {
            identifiantRecommandation: 'q3',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 33' },
        { libelle: 'reponse 34' },
        {
          libelle: 'reponse 41',
          association: {
            identifiantRecommandation: 'q4',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 42',
          association: {
            identifiantRecommandation: 'q4',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 43' },
        { libelle: 'reponse 44' },
        {
          libelle: 'reponse 51',
          association: {
            identifiantRecommandation: 'q5',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 52',
          association: {
            identifiantRecommandation: 'q5',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 53' },
        { libelle: 'reponse 54' },
        {
          libelle: 'reponse 61',
          association: {
            identifiantRecommandation: 'q6',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 62',
          association: {
            identifiantRecommandation: 'q6',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 63' },
        { libelle: 'reponse 64' },
        {
          libelle: 'reponse 71',
          association: {
            identifiantRecommandation: 'q7',
            niveauRecommandation: 1,
            note: 0,
          },
        },
        {
          libelle: 'reponse 72',
          association: {
            identifiantRecommandation: 'q7',
            niveauRecommandation: 2,
            note: 1,
          },
        },
        { libelle: 'reponse 73' },
        { libelle: 'reponse 74' },
      ])
      .construis();

    describe('en ce qui concerne les différents niveaux de recommandations', () => {
      it('prend en compte la note de la réponse pour choisir entre le niveau 1 ou le niveau 2 des recommandations', () => {
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

        const partieCommuneAttendue = {
          noteObtenue: 0,
          pourquoi: 'parce-que',
          comment: 'comme ça',
        };
        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            priorisation: 1,
            titre: 'reco 1',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 3,
            titre: 'reco 3',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 4,
            titre: 'reco 4',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 6,
            titre: 'reco 6',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 2,
            titre: 'reco 22',

            ...partieCommuneAttendue,
            noteObtenue: 1,
          },
          {
            priorisation: 5,
            titre: 'reco 52',
            ...partieCommuneAttendue,
            noteObtenue: 1,
          },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [
            {
              priorisation: 7,
              titre: 'reco 72',
              ...partieCommuneAttendue,
              noteObtenue: 1,
            },
          ],
        );
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
                    uneReponsePossible().avecLibelle('Réponse 83').construis(),
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .avecLesReponsesDonnees('thematique', [{ q8: 'reponse-82' }])
          .avecUnTableauDeRecommandations(tableauDeRecommandations.construis())
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            comment: 'comme ça',
            noteObtenue: 1,
            pourquoi: 'parce-que',
            priorisation: 7,
            titre: 'reco 8',
          },
        ]);
      });
    });

    describe('trie le résultat', () => {
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
              association: {
                identifiantRecommandation: 'q8',
                niveauRecommandation: 1,
                note: 0,
              },
            },
            {
              libelle: 'reponse 82',
              association: {
                identifiantRecommandation: 'q8',
                niveauRecommandation: 2,
                note: 1,
              },
            },
            {
              libelle: 'reponse 91',
              association: {
                identifiantRecommandation: 'q9',
                niveauRecommandation: 1,
                note: 0,
              },
            },
            {
              libelle: 'reponse 92',
              association: {
                identifiantRecommandation: 'q9',
                niveauRecommandation: 2,
                note: 1,
              },
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

        const partieCommuneAttendue = {
          noteObtenue: 0,
          pourquoi: 'parce-que',
          comment: 'comme ça',
        };
        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            priorisation: 1,
            titre: 'reco 4',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 3,
            titre: 'reco 1',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 5,
            titre: 'reco 6',
            ...partieCommuneAttendue,
          },
          {
            priorisation: 6,
            titre: 'reco 7',
            ...partieCommuneAttendue,
          },
          {
            ...partieCommuneAttendue,
            priorisation: 8,
            titre: 'reco 8',
          },
          {
            ...partieCommuneAttendue,
            noteObtenue: 1,
            priorisation: 7,
            titre: 'reco 52',
          },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [
            {
              ...partieCommuneAttendue,
              noteObtenue: 1,
              priorisation: 9,
              titre: 'reco 92',
            },
          ],
        );
      });
    });

    describe("pour des questions dont aucune réponse n'est associée à une recommandation", () => {
      it('les recommandations sont générées uniquement pour les réponses associées', () => {
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

        const partieCommuneAttendue = {
          noteObtenue: 1,
          pourquoi: 'parce-que',
          comment: 'comme ça',
        };
        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            ...partieCommuneAttendue,
            noteObtenue: 0,
            priorisation: 3,
            titre: 'reco 3',
          },
          {
            ...partieCommuneAttendue,
            noteObtenue: 0,
            priorisation: 6,
            titre: 'reco 6',
          },
          {
            ...partieCommuneAttendue,
            priorisation: 2,
            titre: 'reco 22',
          },
          {
            ...partieCommuneAttendue,
            priorisation: 5,
            titre: 'reco 52',
          },
          {
            ...partieCommuneAttendue,
            priorisation: 7,
            titre: 'reco 72',
          },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [],
        );
      });

      describe("dans le cas où aucune réponse associée n'est donnée", () => {
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

        it("il n'y a pas de recommandations", () => {
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
            diagnostic.recommandations?.recommandationsPrioritaires,
          ).toStrictEqual([]);
          expect(
            diagnostic.recommandations?.autresRecommandations,
          ).toStrictEqual([]);
        });
      });
    });
  });
});
