import { describe, expect } from 'vitest';
import { uneReponsePossible } from '../constructeurs/constructeurReferentiel';
import { uneQuestionDiagnostic } from '../constructeurs/constructeurDiagnostic';
import { StrategieDeReponse } from '../../src/diagnostic/StrategieDeReponse';

import { CorpsReponse } from '../../src/diagnostic/CapteurSagaAjoutReponse';

describe('Stratégie de réponse', () => {
  describe('En cas de réponses multiples', () => {
    it('applique la réponse donnée à la question', () => {
      const question = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible().avecLibelle('Réponse 1').construis(),
          uneReponsePossible().avecLibelle('Réponse 2').construis(),
          uneReponsePossible().avecLibelle('Réponse 3').construis(),
        ])
        .construis();

      const corpsDeReponse: CorpsReponse = {
        chemin: '',
        identifiant: question.identifiant,
        reponse: ['reponse-2', 'reponse-1'],
      };
      StrategieDeReponse.pour(corpsDeReponse).applique(question);

      expect(question.reponseDonnee).toStrictEqual({
        reponseUnique: null,
        reponsesMultiples: [
          {
            identifiant: question.identifiant,
            reponses: new Set(['reponse-2', 'reponse-1']),
          },
        ],
      });
    });
  });
});
