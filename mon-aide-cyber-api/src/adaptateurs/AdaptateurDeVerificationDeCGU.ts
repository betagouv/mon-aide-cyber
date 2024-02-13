import { RequestHandler } from 'express';

export interface AdaptateurDeVerificationDeCGU {
  verifie(): RequestHandler;
}
