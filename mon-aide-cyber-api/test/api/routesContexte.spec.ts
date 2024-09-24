import { afterEach, beforeEach, describe, expect } from 'vitest';
import testeurIntegration from './testeurIntegration';
import { Express } from 'express';
import { executeRequete } from './executeurRequete';
import { ReponseHATEOAS } from '../../src/api/hateoas/hateoas';

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

  describe('Dans le cas d’un Aidant ayant une session', () => {
    const testeurMAC = testeurIntegration();
    let donneesServeur: { portEcoute: number; app: Express };

    beforeEach(() => {
      testeurMAC.recuperateurDeCookies = () => 'cookies';
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
  });
});
