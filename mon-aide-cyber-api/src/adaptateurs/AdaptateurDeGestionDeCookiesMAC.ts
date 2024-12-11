import { RequestHandler, Request, Response } from 'express';
import { AdaptateurDeGestionDeCookies } from './AdaptateurDeGestionDeCookies';
import Cookies from 'cookies';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurDeGestionDeCookiesMAC
  implements AdaptateurDeGestionDeCookies
{
  supprime(): RequestHandler {
    return async (requete: Request, reponse: Response, suite: NextFunction) => {
      const cookies = new Cookies(requete, reponse, {
        keys: [process.env.SECRET_COOKIE || ''],
      });
      cookies.set('session');
      suite();
    };
  }
}
