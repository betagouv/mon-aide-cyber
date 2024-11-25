import { DefinitionTuple } from '../../src/relation/Tuple';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdaptateurDeVerificationDeTypeDeRelation } from '../../src/adaptateurs/AdaptateurDeVerificationDeTypeDeRelation';

export class AdaptateurDeVerificationDuTypeDeRelationDeTest
  implements AdaptateurDeVerificationDeTypeDeRelation
{
  private verifieLaRelation = false;

  verifieRelationExiste(): boolean {
    return this.verifieLaRelation;
  }

  verifie<DEFINITION extends DefinitionTuple>(
    _definition: DEFINITION
  ): RequestHandler {
    return (_requete: Request, _reponse: Response, suite: NextFunction) => {
      this.verifieLaRelation = true;
      suite();
    };
  }
}
