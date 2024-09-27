import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { unAidant } from '../../authentification/constructeurs/constructeurAidant';
import { executeRequete } from '../executeurRequete';
import { departements } from '../../../src/gestion-demandes/departements';
import { secteursActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { ReponsePreferencesAidantAPI } from '../../../src/api/aidant/routesAPIAidantPreferences';

describe('Le serveur MAC sur les routes /api/aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
    testeurMAC.adaptateurDeVerificationDeSession.reinitialise();
    testeurMAC.adaptateurDeVerificationDeCGU.reinitialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  describe('Quand une requête GET est reçue sur /preferences', () => {
    it('Retourne les préférences de l’Aidant', async () => {
      const aidant = unAidant().construis();
      await testeurMAC.entrepots.aidants().persiste(aidant);
      testeurMAC.adaptateurDeVerificationDeSession.utilisateurConnecte(aidant);

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<ReponsePreferencesAidantAPI>({
        preferencesAidant: {
          secteursActivite: [],
          departements: [],
        },
        referentiel: {
          secteursActivite: secteursActivite.map((s) => s.nom),
          departements: departements.map((d) => ({ code: d.code, nom: d.nom })),
        },
        liens: {
          'modifier-preferences': {
            url: '/api/aidant/preferences',
            methode: 'PATCH',
          },
        },
      });
    });

    it('Vérifie que les CGU sont signées', async () => {
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`,
        donneesServeur.portEcoute
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Retourne une erreur HTTP 404 si l’Aidant n’est pas connu', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });
});
