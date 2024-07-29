import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { executeRequete } from '../executeurRequete';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';

describe('Le serveur MAC, sur  les routes de demande pour devenir Aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe('Quand une requête POST est reçue', () => {
    it('Réponds à la requête', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { nom: 'nom' }
      );

      expect(reponse.statusCode).toStrictEqual(200);
    });

    it("retourne une erreur et un message informant que le nom de l'aidant est requis si le champs 'nom' est absent", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        {}
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre nom'
      );
    });

    it("retourne une erreur et un message informant que le nom l'aidant est requis si le champs 'nom' est vide", async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        '/api/demandes/devenir-aidant',
        donneesServeur.portEcoute,
        { nom: '' }
      );

      expect(reponse.statusCode).toBe(422);
      expect(JSON.parse(reponse.body).message).toBe(
        'Veuillez renseigner votre nom'
      );
    });
  });
});
