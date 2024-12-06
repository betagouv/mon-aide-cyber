import { DefinitionTuple } from '../relation/Tuple';
import { RequestHandler } from 'express';

export interface AdaptateurDeVerificationDeTypeDeRelation {
  verifie<DEFINITION extends DefinitionTuple>(
    definition: DEFINITION
  ): RequestHandler;
}
