import { AdaptateurDeVerificationDeSession } from '../../src/adaptateurs/AdaptateurDeVerificationDeSession';
import e from 'express';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurDeVerificationDeSessionDeTest
  implements AdaptateurDeVerificationDeSession
{
  constructor(private estPassee = false) {}

  verifie(
    _requete: e.Request,
    _reponse: e.Response,
    suite: NextFunction,
  ): void {
    this.estPassee = true;
    suite();
  }

  verifiePassage(): boolean {
    return this.estPassee;
  }
}
