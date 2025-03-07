import { RequestHandler } from 'express';
import { AdaptateurAseptisation } from './AdaptateurAseptisation';
import { check } from 'express-validator';

export class AdaptateurAseptisationMAC implements AdaptateurAseptisation {
  aseptise(...champsAAseptiser: string[]): RequestHandler {
    return async (requete: any, _reponse: any, suite: any) => {
      const aseptisations = champsAAseptiser.map((p) =>
        check(p).trim().escape().run(requete)
      );
      await Promise.all(aseptisations);
      suite();
    };
  }
}
