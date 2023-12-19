import { RequestHandler } from 'express';
import { Contexte } from '../domaine/erreurMAC';

export interface AdaptateurDeVerificationDeSession {
  verifie(contexte: Contexte): RequestHandler;
}

export class ErreurAccesRefuse extends Error {
  constructor(message: string) {
    super(message);
  }
}
