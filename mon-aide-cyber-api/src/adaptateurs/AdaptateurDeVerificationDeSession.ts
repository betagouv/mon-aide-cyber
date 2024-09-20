import { RequestHandler } from 'express';
import { Contexte } from '../domaine/erreurMAC';

export type InformationsContexte = {
  contexte: string;
};
export interface AdaptateurDeVerificationDeSession {
  verifie(contexte: Contexte): RequestHandler;
}

export class ErreurAccesRefuse extends Error {
  constructor(
    message: string,
    public readonly informationsContexte?: InformationsContexte
  ) {
    super(message);
  }
}
