import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export interface AdaptateurDeVerificationDeSession {
  verifie(requete: Request, _reponse: Response, suite: NextFunction): void;
}
