import { RequestHandler } from 'express';

export interface AdaptateurSignatureRequete {
  verifie(fournisseur: 'TALLY' | 'LIVESTORM'): RequestHandler;
}
