import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from './api/testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './api/executeurRequete';

describe("Consignateur de gestion d'erreurr", () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand le médiateur intercepte une erreur AggregatNonTrouvré', () => {
    it("consigne l'erreur dans le gestionnaire", async () => {
      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        donneesServeur.portEcoute,
        {
          chemin: 'contexte',
          identifiant: 'une-question-',
          reponse: 'reponse-2',
        },
      );

      expect(testeurMAC.gestionnaireErreurs.consignateur().tous()).toHaveLength(
        1,
      );
    });
  });
});
