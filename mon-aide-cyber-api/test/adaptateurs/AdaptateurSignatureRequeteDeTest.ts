import { NextFunction } from 'express-serve-static-core';
import { RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { AdaptateurSignatureRequete } from '../../src/adaptateurs/AdaptateurSignatureRequete';

export class AdaptateurSignatureRequeteDeTest
  implements AdaptateurSignatureRequete
{
  private estPassee = false;
  private fournisseurAppele: 'TALLY' | 'LIVESTORM' | undefined = undefined;

  verifie(fournisseur: 'TALLY' | 'LIVESTORM'): RequestHandler {
    return (
      __requete: RequeteUtilisateur,
      __reponse: Response,
      suite: NextFunction
    ) => {
      this.estPassee = true;
      this.fournisseurAppele = fournisseur;
      return suite();
    };
  }

  verifiePassage(fournisseurAttendu: 'TALLY' | 'LIVESTORM') {
    return this.estPassee && this.fournisseurAppele === fournisseurAttendu;
  }
}
