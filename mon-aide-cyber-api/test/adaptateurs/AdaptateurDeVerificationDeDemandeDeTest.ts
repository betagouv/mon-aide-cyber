import { RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { CorpsRequeteLanceDiagnostic } from '../../src/api/routesAPIDiagnostic';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { AdaptateurDeVerificationDeDemande } from '../../src/adaptateurs/AdaptateurDeVerificationDeDemande';

export class AdaptateurDeVerificationDeDemandeDeTest
  implements AdaptateurDeVerificationDeDemande
{
  private verificationFaite = false;

  verifie(): RequestHandler {
    return (
      _requete: RequeteUtilisateur<CorpsRequeteLanceDiagnostic>,
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
