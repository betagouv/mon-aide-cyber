import { describe, expect, it } from 'vitest';
import {
  unDiagnostic,
  uneNouvelleReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import {
  MoteurDeNote,
  NotesDiagnostic,
} from '../../src/diagnostic/MoteurDeNote';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';

describe('Moteur de note', () => {
  const constructeurDiagnostic = unDiagnostic();

  describe('pour les questions à réponse unique', () => {
    it('génère la note pour une réponse à une question', () => {
      const question = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible().avecLibelle('24').ayantPourNote(0).construis(),
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique', [question])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'thematique',
            question: 'quelle-est-la-reponse',
          },
          uneNouvelleReponseDonnee().reponseSimple('24').construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: 'quelle-est-la-reponse',
            note: 0,
          },
        ],
      });
    });

    it('génère les notes uniquement pour les réponses données', () => {
      const question1 = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible().avecLibelle('24').ayantPourNote(0).construis(),
        ])
        .construis();
      const question2 = uneQuestion()
        .avecReponsesPossibles([uneReponsePossible().construis()])
        .construis();

      const diagnostic = constructeurDiagnostic
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique', [question1, question2])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'thematique',
            question: 'quelle-est-la-reponse',
          },
          uneNouvelleReponseDonnee().reponseSimple('24').construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: 'quelle-est-la-reponse',
            note: 0,
          },
        ],
      });
    });
  });

  describe('pour les questions à tiroir', () => {
    it('génère la note pour une question tiroir', () => {
      const question1 = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible()
            .avecLibelle('24')
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique('Voulez-vous inverser les chiffres?')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('Oui').construis(),
                  uneReponsePossible()
                    .avecLibelle('Non')
                    .ayantPourNote(0)
                    .construis(),
                ])
                .construis(),
            )
            .construis(),
        ])
        .construis();

      const diagnostic = constructeurDiagnostic
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique', [question1])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'thematique',
            question: 'quelle-est-la-reponse',
          },
          uneNouvelleReponseDonnee()
            .reponseMultiple('24', [
              {
                identifiant: 'voulezvous-inverser-les-chiffres',
                reponses: ['non'],
              },
            ])
            .construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            note: 0,
          },
        ],
      });
    });

    it('génère les notes pour une question à plusieurs tiroirs', () => {
      const question1 = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible()
            .avecLibelle('24')
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique('Voulez-vous inverser les chiffres?')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('Oui').construis(),
                  uneReponsePossible()
                    .avecLibelle('Non')
                    .ayantPourNote(0)
                    .construis(),
                ])
                .construis(),
            )
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique('Une question à tiroir?')
                .avecReponsesPossibles([
                  uneReponsePossible()
                    .avecLibelle('Affirmatif')
                    .ayantPourNote(1)
                    .construis(),
                  uneReponsePossible().avecLibelle('Négatif').construis(),
                ])
                .construis(),
            )
            .construis(),
        ])
        .construis();

      const diagnostic = constructeurDiagnostic
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique', [question1])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'thematique',
            question: 'quelle-est-la-reponse',
          },
          uneNouvelleReponseDonnee()
            .reponseMultiple('24', [
              {
                identifiant: 'voulezvous-inverser-les-chiffres',
                reponses: ['non'],
              },
              {
                identifiant: 'une-question-a-tiroir',
                reponses: ['affirmatif'],
              },
            ])
            .construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            note: 0,
          },
          {
            identifiant: 'une-question-a-tiroir',
            note: 1,
          },
        ],
      });
    });

    it('génère les notes pour une question et les réponses aux questions tiroirs', () => {
      const question1 = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible()
            .avecLibelle('24')
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique('Voulez-vous inverser les chiffres?')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('Oui').construis(),
                  uneReponsePossible()
                    .avecLibelle('Non')
                    .ayantPourNote(0)
                    .construis(),
                ])
                .construis(),
            )
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique('Une question à tiroir?')
                .avecReponsesPossibles([
                  uneReponsePossible()
                    .avecLibelle('Affirmatif')
                    .ayantPourNote(1)
                    .construis(),
                  uneReponsePossible().avecLibelle('Négatif').construis(),
                ])
                .construis(),
            )
            .ayantPourNote(0)
            .construis(),
        ])
        .construis();

      const diagnostic = constructeurDiagnostic
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique', [question1])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'thematique',
            question: 'quelle-est-la-reponse',
          },
          uneNouvelleReponseDonnee()
            .reponseMultiple('24', [
              {
                identifiant: 'voulezvous-inverser-les-chiffres',
                reponses: ['non'],
              },
              {
                identifiant: 'une-question-a-tiroir',
                reponses: ['affirmatif'],
              },
            ])
            .construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          { identifiant: 'quelle-est-la-reponse', note: 0 },
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            note: 0,
          },
          {
            identifiant: 'une-question-a-tiroir',
            note: 1,
          },
        ],
      });
    });
  });
});
