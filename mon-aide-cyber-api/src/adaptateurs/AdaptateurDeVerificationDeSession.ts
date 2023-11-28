import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { Contexte } from '../domaine/erreurMAC';

export interface AdaptateurDeVerificationDeSession {
  verifie(
    contexte: Contexte,
    requete: Request,
    _reponse: Response,
    suite: NextFunction,
  ): void;
}

export class ErreurAccesRefuse extends Error {
  constructor(message: string) {
    super(message);
  }
}
