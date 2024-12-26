import { Request, RequestHandler, Response } from 'express';
import { AdaptateurDeGestionDeCookies } from './AdaptateurDeGestionDeCookies';
import { NextFunction } from 'express-serve-static-core';
import { utilitairesCookies } from './utilitairesDeCookies';

export class AdaptateurDeGestionDeCookiesMAC
  implements AdaptateurDeGestionDeCookies
{
  supprime(): RequestHandler {
    return async (requete: Request, reponse: Response, suite: NextFunction) => {
      utilitairesCookies.reinitialiseLaSession(requete, reponse);
      return suite();
    };
  }
}
