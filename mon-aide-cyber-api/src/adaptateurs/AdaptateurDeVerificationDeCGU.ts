import { RequestHandler } from 'express';

export class UtilisateurNonTrouve extends Error {
  constructor() {
    super("L'utilisateur voulant accédé à cette ressource n'est pas connu.");
  }
}

export interface AdaptateurDeVerificationDeCGU {
  verifie(): RequestHandler;
}
