import { RequestHandler } from 'express';

export interface AdaptateurSignatureRequete {
  verifie(): RequestHandler;
}
