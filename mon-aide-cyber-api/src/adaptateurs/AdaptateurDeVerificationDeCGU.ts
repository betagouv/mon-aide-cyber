import { Contexte } from '../domaine/erreurMAC';
import { RequestHandler } from 'express';

export class UtilisateurNonTrouve extends Error {
  constructor(contexte: Contexte) {
    super(
      `[${contexte}] L'utilisateur voulant accéder à cette ressource n'est pas connu.`
    );
  }
}

export interface AdaptateurDeVerificationDeCGU {
  verifie(contexte: Contexte): RequestHandler;
}
