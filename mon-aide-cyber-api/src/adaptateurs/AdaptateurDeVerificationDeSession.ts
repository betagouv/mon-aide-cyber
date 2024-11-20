import { RequestHandler } from 'express';
import { Contexte } from '../domaine/erreurMAC';
import { ContextesUtilisateur } from '../api/hateoas/contextesUtilisateur';

export type InformationsContexte = {
  contexte: keyof ContextesUtilisateur;
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
