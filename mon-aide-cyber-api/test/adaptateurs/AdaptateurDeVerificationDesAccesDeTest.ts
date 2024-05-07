import { AdaptateurDeVerificationDesAcces } from '../../src/adaptateurs/AdaptateurDeVerificationDesAcces';
import { Relation } from '../../src/relation/Tuple';
import {
  ConstructeurObjet,
  ConstructeurUtilisateur,
} from '../../src/definition-type/relations';
import { RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurDeVerificationDesAccesDeTest
  implements AdaptateurDeVerificationDesAcces
{
  private verifieLaRelation = false;

  verifieRelationExiste(): boolean {
    return this.verifieLaRelation;
  }

  verifie(
    _relation: Relation,
    _utilisateur: typeof ConstructeurUtilisateur,
    _objet: typeof ConstructeurObjet,
  ): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction,
    ) => {
      this.verifieLaRelation = true;
      suite();
    };
  }
}
