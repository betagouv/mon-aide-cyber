import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import testeurIntegration from '../testeurIntegration';
import { Express } from 'express';
import { executeRequete } from '../executeurRequete';
import {
  ain,
  aisne,
  allier,
  departements,
} from '../../../src/gestion-demandes/departements';
import { secteursActivite } from '../../../src/espace-aidant/preferences/secteursActivite';
import { ReponsePreferencesAidantAPI } from '../../../src/api/aidant/routesAPIAidantPreferences';
import { typesEntites } from '../../../src/espace-aidant/Aidant';

import {
  unAidant,
  unAidantConnecteInconnu,
  unCompteAidantConnecte,
  unCompteAidantConnecteViaProConnect,
} from '../../constructeurs/constructeursAidantUtilisateurInscritUtilisateur';

describe('Le serveur MAC sur les routes /api/aidant', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { app: Express };

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
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant(),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      expect(reponse.statusCode).toBe(200);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
      expect(await reponse.json()).toStrictEqual<ReponsePreferencesAidantAPI>({
        preferencesAidant: {
          secteursActivite: [],
          departements: [],
          typesEntites: [],
        },
        referentiel: {
          secteursActivite: secteursActivite.map((s) => s.nom),
          departements: departements.map((d) => ({ code: d.code, nom: d.nom })),
          typesEntites,
        },
        liens: {
          'modifier-preferences': {
            url: '/api/aidant/preferences',
            methode: 'PATCH',
          },
          'se-deconnecter': {
            url: '/api/token',
            methode: 'DELETE',
            typeAppel: 'API',
          },
        },
      });
    });

    it('Retourne l’action de déconnexion de l’Aidant propre à ProConnect', async () => {
      await unCompteAidantConnecteViaProConnect({
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant(),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      expect((await reponse.json()).liens['se-deconnecter']).toStrictEqual({
        url: '/pro-connect/deconnexion',
        methode: 'GET',
        typeAppel: 'DIRECT',
      });
    });

    it('Retourne les secteurs d’activité que l’Aidant a conservé', async () => {
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant().ayantPourSecteursActivite([
          { nom: 'Administration' },
          { nom: 'Commerce' },
          { nom: 'Transports' },
        ]),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      const reponsePreferences =
        (await reponse.json()) as ReponsePreferencesAidantAPI;
      expect(
        reponsePreferences.preferencesAidant.secteursActivite
      ).toStrictEqual<string[]>(['Administration', 'Commerce', 'Transports']);
    });

    it('Retourne les départements dans lesquels l’Aidant peut intervenir', async () => {
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant().ayantPourDepartements([
          ain,
          aisne,
          allier,
        ]),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      const reponsePreferences =
        (await reponse.json()) as ReponsePreferencesAidantAPI;
      expect(reponsePreferences.preferencesAidant.departements).toStrictEqual<
        string[]
      >([ain.nom, aisne.nom, allier.nom]);
    });

    it('Retourne les types d’entités dans lesquels l’Aidant peut intervenir', async () => {
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant().ayantPourTypesEntite([
          {
            nom: 'Organisations publiques',
            libelle:
              'Organisations publiques (ex. collectivité, administration, etc.)',
          },
          {
            nom: 'Associations',
            libelle: 'Associations (ex. association loi 1901, GIP)',
          },
        ]),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      const reponsePreferences =
        (await reponse.json()) as ReponsePreferencesAidantAPI;
      expect(reponsePreferences.preferencesAidant.typesEntites).toStrictEqual<
        string[]
      >(['Organisations publiques', 'Associations']);
    });

    it('Vérifie que les CGU sont signées', async () => {
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant(),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });
      await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Retourne une erreur HTTP 404 si l’Aidant n’est pas connu', async () => {
      await unAidantConnecteInconnu({
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/aidant/preferences`
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });
  });

  describe('Quand une requête PATCH est reçue sur /preferences', () => {
    it('vérifie la session de l’Aidant', async () => {
      await unCompteAidantConnecte({
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        constructeurAidant: unAidant().ayantPourSecteursActivite([
          { nom: 'Administration' },
          { nom: 'Commerce' },
        ]),
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/aidant/preferences`,
        {
          preferencesAidant: {
            secteursActivite: ['Administration', 'Transports'],
          },
        }
      );

      expect(reponse.statusCode).toBe(204);
      expect(
        testeurMAC.adaptateurDeVerificationDeSession.verifiePassage()
      ).toBe(true);
    });

    it('Vérifie les CGU', async () => {
      await unCompteAidantConnecte({
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
        constructeurAidant: unAidant(),
        entrepotAidant: testeurMAC.entrepots.aidants(),
        entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
      });

      await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/aidant/preferences`,
        {
          preferencesAidant: {
            typesEntites: ['Organisations publiques', 'Associations'],
          },
        }
      );

      expect(testeurMAC.adaptateurDeVerificationDeCGU.verifiePassage()).toBe(
        true
      );
    });

    it('Retourne une erreur HTTP 404 si l’Aidant n’est pas connu', async () => {
      await unAidantConnecteInconnu({
        adaptateurDeVerificationDeSession:
          testeurMAC.adaptateurDeVerificationDeSession,
      });

      const reponse = await executeRequete(
        donneesServeur.app,
        'PATCH',
        `/api/aidant/preferences`,
        {
          preferencesAidant: {
            typesEntites: ['Organisations publiques', 'Associations'],
          },
        }
      );

      expect(reponse.statusCode).toBe(404);
      expect(await reponse.json()).toStrictEqual({
        message: "Le aidant demandé n'existe pas.",
      });
    });

    describe('Lors de la phase de validation', () => {
      it("Valide les secteurs d'activité passés dans la requête", async () => {
        await unCompteAidantConnecte({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurAidant: unAidant(),
          adaptateurDeVerificationDeSession:
            testeurMAC.adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/aidant/preferences`,
          {
            preferencesAidant: {
              secteursActivite: ['Inconnu', 'Inexistant'],
            },
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: "Les secteurs d'activité sont erronés.",
        });
      });

      it('Valide les départements passés dans la requête', async () => {
        await unCompteAidantConnecte({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurAidant: unAidant(),
          adaptateurDeVerificationDeSession:
            testeurMAC.adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/aidant/preferences`,
          {
            preferencesAidant: {
              departements: ['Inconnu', 'Inexistant'],
            },
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Les départements sont erronés.',
        });
      });

      it('Valide les types d’entités passés dans la requête', async () => {
        await unCompteAidantConnecte({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurAidant: unAidant(),
          adaptateurDeVerificationDeSession:
            testeurMAC.adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/aidant/preferences`,
          {
            preferencesAidant: {
              typesEntites: ['Inconnu', 'Inexistant'],
            },
          }
        );

        expect(reponse.statusCode).toBe(422);
        expect(await reponse.json()).toStrictEqual({
          message: 'Les types d’entités sont erronés.',
        });
      });

      it('Valide la consistence de la requête', async () => {
        await unCompteAidantConnecte({
          entrepotUtilisateur: testeurMAC.entrepots.utilisateurs(),
          entrepotAidant: testeurMAC.entrepots.aidants(),
          constructeurAidant: unAidant(),
          adaptateurDeVerificationDeSession:
            testeurMAC.adaptateurDeVerificationDeSession,
        });

        const reponse = await executeRequete(
          donneesServeur.app,
          'PATCH',
          `/api/aidant/preferences`,
          {
            champsInconnu: 'valeur inconnue',
            preferencesAidant: {
              secteursActivite: ['Administration', 'Transports'],
            },
          }
        );

        expect(reponse.statusCode).toBe(400);
      });
    });
  });
});
