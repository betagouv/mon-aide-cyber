import { describe, expect, it } from 'vitest';
import {
  unDiagnostic,
  uneReponseDonnee,
} from '../constructeurs/constructeurDiagnostic';
import {
  MoteurIndice,
  ValeursDesIndicesAuDiagnostic,
} from '../../src/diagnostic/MoteurIndice';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from '../constructeurs/constructeurReferentiel';

describe('Moteur Indice', () => {
  const constructeurDiagnostic = unDiagnostic();

  describe('pour les questions à réponse unique', () => {
    it("génère l'indice pour une réponse à une question", () => {
      const question = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible()
            .avecLibelle('24')
            .ayantPourValeurDIndice(0)
            .construis(),
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
          uneReponseDonnee().ayantPourReponse('24').construis(),
        )
        .construis();

      const valeursDesIndices =
        MoteurIndice.genereLesIndicesDesReponses(diagnostic);

      expect(valeursDesIndices).toStrictEqual<ValeursDesIndicesAuDiagnostic>({
        thematique: [
          {
            identifiant: 'quelle-est-la-reponse',
            indice: { valeur: 0 },
          },
        ],
      });
    });

    it('génère les indices uniquement pour les réponses données', () => {
      const question1 = uneQuestion()
        .aChoixUnique('Quelle est la réponse?')
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle('42').construis(),
          uneReponsePossible()
            .avecLibelle('24')
            .ayantPourValeurDIndice(0)
            .construis(),
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
          uneReponseDonnee().ayantPourReponse('24').construis(),
        )
        .construis();

      const valeursDesIndices =
        MoteurIndice.genereLesIndicesDesReponses(diagnostic);

      expect(valeursDesIndices).toStrictEqual<ValeursDesIndicesAuDiagnostic>({
        thematique: [
          {
            identifiant: 'quelle-est-la-reponse',
            indice: { valeur: 0 },
          },
        ],
      });
    });
  });

  describe('pour les questions à tiroir', () => {
    it("génère l'indice pour une question tiroir", () => {
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
                    .ayantPourValeurDIndice(0)
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
          uneReponseDonnee()
            .ayantPourReponse('24')
            .avecDesReponsesMultiples([
              {
                identifiant: 'voulezvous-inverser-les-chiffres',
                reponses: ['non'],
              },
            ])
            .construis(),
        )
        .construis();

      const valeursDesIndices =
        MoteurIndice.genereLesIndicesDesReponses(diagnostic);

      expect(valeursDesIndices).toStrictEqual<ValeursDesIndicesAuDiagnostic>({
        thematique: [
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            indice: { valeur: 0 },
          },
        ],
      });
    });

    it('génère les indices pour une question à plusieurs tiroirs', () => {
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
                    .ayantPourValeurDIndice(0)
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
                    .ayantPourValeurDIndice(1)
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
          uneReponseDonnee()
            .ayantPourReponse('24')
            .avecDesReponsesMultiples([
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

      const valeursDesIndices =
        MoteurIndice.genereLesIndicesDesReponses(diagnostic);

      expect(valeursDesIndices).toStrictEqual<ValeursDesIndicesAuDiagnostic>({
        thematique: [
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            indice: { valeur: 0 },
          },
          {
            identifiant: 'une-question-a-tiroir',
            indice: { valeur: 1 },
          },
        ],
      });
    });

    it('génère les indices pour une question et les réponses aux questions tiroirs', () => {
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
                    .ayantPourValeurDIndice(0)
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
                    .ayantPourValeurDIndice(1)
                    .construis(),
                  uneReponsePossible().avecLibelle('Négatif').construis(),
                ])
                .construis(),
            )
            .ayantPourValeurDIndice(0)
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
          uneReponseDonnee()
            .ayantPourReponse('24')
            .avecDesReponsesMultiples([
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

      const valeursDesIndices =
        MoteurIndice.genereLesIndicesDesReponses(diagnostic);

      expect(valeursDesIndices).toStrictEqual<ValeursDesIndicesAuDiagnostic>({
        thematique: [
          {
            identifiant: 'quelle-est-la-reponse',
            indice: { valeur: 0 },
          },
          {
            identifiant: 'voulezvous-inverser-les-chiffres',
            indice: { valeur: 0 },
          },
          {
            identifiant: 'une-question-a-tiroir',
            indice: { valeur: 1 },
          },
        ],
      });
    });
  });
});
