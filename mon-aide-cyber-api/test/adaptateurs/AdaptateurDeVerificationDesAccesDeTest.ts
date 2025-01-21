import { AdaptateurDeVerificationDesAcces } from '../../src/adaptateurs/AdaptateurDeVerificationDesAcces';
import { DefinitionTuple } from '../../src/relation/Tuple';
import { Request, RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../../src/api/routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { isEqual } from 'lodash';

export class AdaptateurDeVerificationDesAccesDeTest
  implements AdaptateurDeVerificationDesAcces
{
  private verifieLaRelation = false;
  private definitionRecue: any | undefined = undefined;

  verifieRelationExiste<DEFINITION extends DefinitionTuple>(
    definition: DEFINITION
  ): boolean {
    const test = isEqual(this.definitionRecue, definition);
    return this.verifieLaRelation && test;
  }

  verifie<DEFINITION extends DefinitionTuple, _T extends Request>(
    definition: DEFINITION
  ): RequestHandler {
    return (
      _requete: RequeteUtilisateur,
      _reponse: Response,
      suite: NextFunction
    ) => {
      this.verifieLaRelation = true;
      this.definitionRecue = definition;
      suite();
    };
  }
}
