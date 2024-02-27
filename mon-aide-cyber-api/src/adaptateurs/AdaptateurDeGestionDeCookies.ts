import { Request, Response } from 'express';

export interface AdaptateurDeGestionDeCookies {
  supprime(requete: Request, response: Response): void;
}
