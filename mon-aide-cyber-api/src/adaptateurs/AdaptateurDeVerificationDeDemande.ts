import { RequestHandler } from 'express';

export interface AdaptateurDeVerificationDeDemande {
  verifie(): RequestHandler;
}
