import { NextFunction } from 'express-serve-static-core';
import { RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { AdaptateurSignatureRequete } from '../../src/adaptateurs/AdaptateurSignatureRequete';

export class AdaptateurSignatureRequeteDeTest
  implements AdaptateurSignatureRequete
{
  private estPassee = false;

  verifie(__fournisseur: 'TALLY' | 'LIVESTORM'): RequestHandler {
    return (
      __requete: RequeteUtilisateur,
      __reponse: Response,
      suite: NextFunction
    ) => {
      this.estPassee = true;
      return suite();
    };
  }

  verifiePassage() {
    return this.estPassee;
  }
}
