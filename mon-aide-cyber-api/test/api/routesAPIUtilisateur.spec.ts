import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { FournisseurHorloge } from '../../src/infrastructure/horloge/FournisseurHorloge';
import { FournisseurHorlogeDeTest } from '../infrastructure/horloge/FournisseurHorlogeDeTest';

describe('le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête POST est reçue sur /finalise', () => {
    it('marque les CGU à signées', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantFinalisantSonCompte = unAidant()
        .avecCompteEnAttenteDeFinalisation()
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidantFinalisantSonCompte);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantFinalisantSonCompte,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/finalise`,
        donneesServeur.portEcoute,
        { cguSignees: true, charteSignee: true },
      );

      expect(reponse.statusCode).toBe(204);
      const aidantRetrouve = await testeurMAC.entrepots
        .aidants()
        .lis(aidantFinalisantSonCompte.identifiant);
      expect(aidantRetrouve.dateSignatureCGU).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
      expect(aidantRetrouve.dateSignatureCharte).toStrictEqual(
        FournisseurHorloge.maintenant(),
      );
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
    });

    it('renvoie une erreur HTTP 422 si les CGU ne sont pas acceptées', async () => {
      FournisseurHorlogeDeTest.initialise(
        new Date(Date.parse('2024-02-04T13:04:25+01:00')),
      );
      const aidantFinalisantSonCompte = unAidant()
        .avecCompteEnAttenteDeFinalisation()
        .construis();
      await testeurMAC.entrepots.aidants().persiste(aidantFinalisantSonCompte);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(
        aidantFinalisantSonCompte,
      );

      const reponse = await executeRequete(
        donneesServeur.app,
        'POST',
        `/api/utilisateur/finalise`,
        donneesServeur.portEcoute,
        { cguSignees: false, charteSignee: true },
      );

      expect(reponse.statusCode).toBe(422);
      expect(await reponse.json()).toStrictEqual({
        message: 'Vous devez valider les CGU.',
      });
    });
  });
});
