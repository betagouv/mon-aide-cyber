import { AdaptateurDeVerificationDeCGU } from '../../src/adaptateurs/AdaptateurDeVerificationDeCGU';
import { RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { NextFunction } from 'express-serve-static-core';

export class AdapatateurDeVerificationDeCGUDeTest
  implements AdaptateurDeVerificationDeCGU
{
  private verificationFaite = false;

  verifie(): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.verificationFaite = true;
      suite();
    };
  }

  verifiePassage(): boolean {
    return this.verificationFaite;
  }

  reinitialise() {
    this.verificationFaite = false;
  }
}
