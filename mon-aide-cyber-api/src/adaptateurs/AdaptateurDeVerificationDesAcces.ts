import { DefinitionTuple } from '../relation/Tuple';
import { RequestHandler } from 'express';

export interface AdaptateurDeVerificationDesAcces {
  verifie<DEFINITION extends DefinitionTuple>(
    definition: DEFINITION
  ): RequestHandler;
}
