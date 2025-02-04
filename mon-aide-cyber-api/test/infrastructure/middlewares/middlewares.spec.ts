import { beforeEach, describe, expect, it } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { redirigeVersUrlBase } from '../../../src/infrastructure/middlewares/middlewares';
import { adaptateurEnvironnement } from '../../../src/adaptateurs/adaptateurEnvironnement';

describe('Les middlewares', () => {
  describe('De redirection', () => {
    const requete: Request = {} as Request;
    const reponse: Response = {} as Response;
    const suite: NextFunction = () => null;

    beforeEach(() => {
      adaptateurEnvironnement.mac = () => ({
        urlMAC: () => 'http://domaine:1234',
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
});
