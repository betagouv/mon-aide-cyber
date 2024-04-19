import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';

describe('le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne l'utilisateur connecté", async () => {
      const aidant = unAidant().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: aidant.nomPrenom,
        liens: {
          'lancer-diagnostic': {
            url: '/api/diagnostic',
            methode: 'POST',
          },
          'afficher-tableau-de-bord': {
            methode: 'GET',
            url: '/api/espace-aidant/tableau-de-bord',
          },
          'afficher-profil': {
            url: '/api/profil',
            methode: 'GET',
          },
        },
      });
    });

    it("retourne l'utilisateur connecté avec le lien de création d'espace Aidant", async () => {
      const aidant = unAidant().sansEspace().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        nomPrenom: aidant.nomPrenom,
        liens: {
          'creer-espace-aidant': {
            url: '/api/espace-aidant/cree',
            methode: 'POST',
          },
        },
      });
    });

    it("retourne une erreur HTTP 404 si l'utilisateur n'est pas connu", async () => {
      testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute,
      );

      expect(reponse.statusCode).toBe(404);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage(),
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });
});
