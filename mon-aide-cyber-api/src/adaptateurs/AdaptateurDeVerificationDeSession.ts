import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export interface AdaptateurDeVerificationDeSession {
  verifie(requete: Request, _reponse: Response, suite: NextFunction): void;
}

export class ErreurAccesRefuse implements Error {
  message: string;
  name: string;

  constructor(message: string) {
    this.name = '';
    this.message = message;
  }
}
