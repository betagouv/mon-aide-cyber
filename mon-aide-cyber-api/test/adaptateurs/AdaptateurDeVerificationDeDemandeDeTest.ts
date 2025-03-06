import { RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { CorpsRequeteLanceDiagnostic } from '../../src/api/routesAPIDiagnostic';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { AdaptateurDeVerificationDeDemande } from '../../src/adaptateurs/AdaptateurDeVerificationDeDemande';

export class AdaptateurDeVerificationDeDemandeDeTest
  implements AdaptateurDeVerificationDeDemande
{
  private emailEntiteAidee = '';

  verifie(): RequestHandler {
    return (
      requete: RequeteUtilisateur<CorpsRequeteLanceDiagnostic>,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.emailEntiteAidee = requete.body.emailEntiteAidee;
      suite();
    };
  }

  verifiePassage(emailEntiteAidee: string): boolean {
    return this.emailEntiteAidee === emailEntiteAidee;
  }

  reinitialise() {
    this.emailEntiteAidee = '';
  }
}
