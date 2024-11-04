import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';
import { unAidant } from '../espace-aidant/constructeurs/constructeurAidant';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';

describe('Route contexte', () => {
  const testeurMAC = testeurIntegration();
  let donneesServeur: { portEcoute: number; app: Express };

  beforeEach(() => {
    donneesServeur = testeurMAC.initialise();
  });

  afterEach(() => {
    testeurMAC.arrete();
  });

  it('Retourne les actions publiques si le contexte n’est pas fourni', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/contexte`,
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
      liens: {
        'demande-devenir-aidant': {
          url: '/api/demandes/devenir-aidant',
          methode: 'GET',
        },
        'demande-etre-aide': {
          url: '/api/demandes/etre-aide',
          methode: 'GET',
        },
        'se-connecter': { url: '/api/token', methode: 'POST' },
      },
    });
  });

  it('Retourne les actions spécifiques au contexte fourni', async () => {
    const reponse = await executeRequete(
      donneesServeur.app,
      'GET',
      `/api/contexte?contexte=demande-devenir-aidant:finalise-creation-espace-aidant`,
      donneesServeur.portEcoute
    );

    expect(reponse.statusCode).toBe(200);
    expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
      liens: {
        'finalise-creation-espace-aidant': {
          url: '/api/demandes/devenir-aidant/creation-espace-aidant',
          methode: 'POST',
        },
      },
    });
  });

  describe('Dans le cas d’un Aidant avec espace ayant une session', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { portEcoute: number; app: Express };

    beforeEach(async () => {
      const aidant = unAidant().construis();
      testeurMAC.recuperateurDeCookies = () =>
        btoa(
          JSON.stringify({
            token: JSON.stringify({
              identifiant: aidant.identifiant,
            }),
          })
        );
      await testeurMAC.entrepots.aidants().persiste(aidant);
      donneesServeur = testeurMAC.initialise();
    });

    it('Retourne le tableau de bord Aidant si il revient sur la page d’accueil de MAC', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/contexte`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'afficher-tableau-de-bord': {
            url: '/api/espace-aidant/tableau-de-bord',
            methode: 'GET',
          },
        },
      });
    });

    describe('Lorsqu’une erreur est levée', () => {
      beforeEach(() => {
        testeurMAC.gestionnaireDeJeton = new FauxGestionnaireDeJeton(true);
        donneesServeur = testeurMAC.initialise();
      });

      afterEach(() => {
        testeurMAC.arrete();
      });

      it('Retourne le lien vers le tableau de bord', async () => {
        const aidant = unAidant().sansEspace().construis();
        await testeurMAC.entrepots.aidants().persiste(aidant);

        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          `/api/contexte`,
          donneesServeur.portEcoute
        );

        expect(reponse.statusCode).toBe(200);
        expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
          liens: {
            'demande-devenir-aidant': {
              url: '/api/demandes/devenir-aidant',
              methode: 'GET',
            },
            'demande-etre-aide': {
              url: '/api/demandes/etre-aide',
              methode: 'GET',
            },
            'se-connecter': { url: '/api/token', methode: 'POST' },
          },
        });
      });
    });
  });

  describe('Dans le cas d’un Aidant sans espace ayant une session', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { portEcoute: number; app: Express };

    beforeEach(async () => {
      const aidant = unAidant().sansEspace().construis();
      testeurMAC.recuperateurDeCookies = () =>
        btoa(
          JSON.stringify({
            token: JSON.stringify({
              identifiant: aidant.identifiant,
            }),
          })
        );
      await testeurMAC.entrepots.aidants().persiste(aidant);
      donneesServeur = testeurMAC.initialise();
    });
    it('Retourne le lien vers la création de l’espace aidant si il s’agit d’une première connexion', async () => {
      const reponse = await executeRequete(
        donneesServeur.app,
        'GET',
        `/api/contexte`,
        donneesServeur.portEcoute
      );

      expect(reponse.statusCode).toBe(200);
      expect(await reponse.json()).toStrictEqual<ReponseHATEOAS>({
        liens: {
          'creer-espace-aidant': {
            url: '/api/espace-aidant/cree',
            methode: 'POST',
          },
        },
      });
    });
  });
});
