import { afterEach, beforeEach, describe, expect } from 'vitest';
import { unAidant } from '../authentification/constructeurs/constructeurAidant';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { AdaptateurDeVerificationDeSessionAvecContexteDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionAvecContexteDeTest';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';

describe('le serveur MAC sur les routes /api/utilisateur', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };
  let adaptateurDeVerificationDeSession: AdaptateurDeVerificationDeSessionDeTest;

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
    adaptateurDeVerificationDeSession =
      testeurMAC.adaptateurDeVerificationDeSession as AdaptateurDeVerificationDeSessionDeTest;
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('quand une requête GET est reçue sur /', () => {
    it("retourne l'utilisateur connecté", async () => {
      const aidant = unAidant().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
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
      adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
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
      adaptateurDeVerificationDeSession.reinitialise();
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/utilisateur/`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(404);
      expect(adaptateurDeVerificationDeSession.verifiePassage()).toBe(true);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });

    describe('Lorsque l’on fournit des informations de contexte', () => {
      beforeEach(() => {
        testeurMAC.adaptateurDeVerificationDeSession =
          new AdaptateurDeVerificationDeSessionAvecContexteDeTest();
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it('retourne les liens correspondant', async () => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/utilisateur?contexte=demande-devenir-aidant:finalise-creation-espace-aidant`,
          donneesServeur.portEcoute
        );

        expect(reponse.statusCode).toBe(403);
        expect(await reponse.json()).toStrictEqual({
          message: "L'accès à la ressource est interdit.",
          liens: {
            'finalise-creation-espace-aidant': {
              url: '/api/demandes/devenir-aidant/creation-espace-aidant',
              methode: 'POST',
            },
          },
        });
      });
    });
  });
});
