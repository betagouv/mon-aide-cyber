import { AdaptateurDeVerificationDeSession } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { NextFunction } from 'express-serve-static-core';
import { Request, RequestHandler, Response } from 'express';
import { Contexte } from '../../src/domaine/erreurMAC';

export class AdaptateurDeVerificationDeSessionDeTest
  implements AdaptateurDeVerificationDeSession
{
  constructor(private estPassee = false) {}

  verifie(__contexte: Contexte): RequestHandler {
    return (_requete: Request, _reponse: Response, suite: NextFunction) => {
      this.estPassee = true;
      suite();
    };
  }

  verifiePassage(): boolean {
    return this.estPassee;
  }
}
