import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdaptateurAseptisation } from '../../src/adaptateurs/AdaptateurAseptisation';

export class AdaptateurAseptisationDeTest implements AdaptateurAseptisation {
  private champsAseptises: string[] = [];

  aseptise(...champsAAseptiser: string[]): RequestHandler {
    return (_request: Request, _reponse: Response, suite: NextFunction) => {
      this.champsAseptises = champsAAseptiser;
      return suite();
    };
  }

  ontEteAseptises(...champsAAseptiser: string[]): boolean {
    return champsAAseptiser.every((champ) =>
      this.champsAseptises.includes(champ)
    );
  }
}
