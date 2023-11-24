import { AdaptateurDeVerificationDeSession } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';
import { Contexte } from '../../src/domaine/erreurMAC';

export class AdaptateurDeVerificationDeSessionDeTest
  implements AdaptateurDeVerificationDeSession
{
  constructor(private estPassee = false) {}

  verifie(
    _contexte: Contexte,
    _requete: Request,
    _reponse: Response,
    suite: NextFunction,
  ): void {
    this.estPassee = true;
    suite();
  }

  verifiePassage(): boolean {
    return this.estPassee;
  }
}
