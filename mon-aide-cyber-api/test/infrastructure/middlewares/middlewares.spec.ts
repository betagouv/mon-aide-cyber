import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Express, NextFunction, Request, Response } from 'express';
import { redirigeVersUrlBase } from '../../../src/infrastructure/middlewares/middlewares';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';
import testeurIntegration from '../../api/testeurIntegration';
import { executeRequete } from '../../api/executeurRequete';

describe('Les middlewares', () => {
  describe('De redirection', () => {
    const requete: Request = {} as Request;
    const reponse: Response = {} as Response;
    const suite: NextFunction = () => null;

    beforeEach(() => {
      adaptateurEnvironnement.mac = () => ({
        urlMAC: () => 'http://domaine:1234',
        urlAideMAC: () => 'http://domaine:1234',
      });
    });

    it("Redirige l'utilisateur vers l'url de base s'il vient d'un sous domaine", () => {
      requete.headers = { host: 'sousdomaine.domaine:1234' };
      requete.originalUrl = '/monUrlDemandee';
      let urlRecue = '';
      reponse.redirect = (url) => {
        urlRecue = url as string;
      };

      redirigeVersUrlBase(requete, reponse, suite);

      expect(urlRecue).toStrictEqual('http://domaine:1234/monUrlDemandee');
    });

    it("Ne redirige pas l'utilisateur vers l'url de base s'il en provient déjà", () => {
      let passeDansLaSuite = false;
      const suite: NextFunction = () => {
        passeDansLaSuite = true;
      };
      requete.headers = { host: 'domaine:1234' };
      requete.originalUrl = '/monUrlDemandee';

      redirigeVersUrlBase(requete, reponse, suite);

      expect(passeDansLaSuite).toBe(true);
    });
  });

  describe('Pour le cache', () => {
    type ParametreCache = {
      ressource: string;
      methode: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      statusCode: number;
    };

    let testeurMAC = testeurIntegration();
    let donneesServeur: { app: Express };

    beforeEach(() => {
      testeurMAC = testeurIntegration();
      donneesServeur = testeurMAC.initialise();
    });

    afterEach(() => {
      testeurMAC.arrete();
    });

    it.each<ParametreCache>([
      { ressource: '/api/contexte', methode: 'GET', statusCode: 200 },
      {
        ressource: '/pro-connect/deconnexion',
        methode: 'GET',
        statusCode: 401,
      },
      { ressource: '/contact/', methode: 'POST', statusCode: 400 },
      { ressource: '/statistiques', methode: 'GET', statusCode: 200 },
    ])(
      'Vérifie la présence des HEADERS interdisant la mise en cache sur la ressource $ressource',
      async ({ ressource, methode, statusCode }) => {
        const reponse = await executeRequete(
          donneesServeur.app,
          methode,
          ressource
        );

        expect(reponse.statusCode).toBe(statusCode);
        expect(reponse.headers['surrogate-control']).toBe('no-store');
        expect(reponse.headers['expires']).toBe('0');
        expect(reponse.headers['surrogate-control']).toBe('no-store');
        expect(reponse.headers['cache-control']).toBe(
          'no-store, no-cache, must-revalidate, proxy-revalidate'
        );
      }
    );

    it.each([
      { ressource: '/assets', statusCode: 301 },
      { ressource: '/fichiers', statusCode: 301 },
      { ressource: '/fontes', statusCode: 301 },
      { ressource: '/images', statusCode: 301 },
      { ressource: '/lab-anssi-ui-kit', statusCode: 301 },
    ])(
      'Vérifie que la ressource $ressource peut être mise en cache',
      async ({ ressource, statusCode }) => {
        const reponse = await executeRequete(
          donneesServeur.app,
          'GET',
          ressource,
          {
            nom: 'Jean Dupont',
            email: 'jean-dupont@email.com',
            message: 'Bonjour le monde!',
          }
        );

        expect(reponse.statusCode).toBe(statusCode);
        expect(reponse.headers['cache-control']).toBeUndefined();
      }
    );
  });
});
