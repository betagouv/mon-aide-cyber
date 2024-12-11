import { AdaptateurDeGestionDeCookies } from '../../src/adaptateurs/AdaptateurDeGestionDeCookies';
import { RequestHandler, Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurDeGestionDeCookiesDeTest
  implements AdaptateurDeGestionDeCookies
{
  aSupprime = false;

  supprime(): RequestHandler {
    return (_requete: Request, _reponse: Response, suite: NextFunction) => {
      this.aSupprime = true;
      suite();
    };
  }
}
