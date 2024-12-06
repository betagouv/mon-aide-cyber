import { AdaptateurDeVerificationDesAcces } from '../../src/adaptateurs/AdaptateurDeVerificationDesAcces';
import { DefinitionTuple } from '../../src/relation/Tuple';
import { Request, RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurDeVerificationDesAccesDeTest
  implements AdaptateurDeVerificationDesAcces
{
  private verifieLaRelation = false;
  verifieRelationExiste(): boolean {
    return this.verifieLaRelation;
  }

  verifie<DEFINITION extends DefinitionTuple, _T extends Request>(
    _definition: DEFINITION
  ): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.verifieLaRelation = true;
      suite();
    };
  }
}
