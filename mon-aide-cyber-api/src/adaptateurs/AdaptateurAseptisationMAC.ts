import { RequestHandler } from 'express';
import { AdaptateurAseptisation } from './AdaptateurAseptisation';
import { check } from 'express-validator';

export class AdaptateurAseptisationMAC implements AdaptateurAseptisation {
  aseptise(...champsAAseptiser: string[]): RequestHandler {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return async (requete: any, _reponse: any, suite: any) => {
      /* eslint-enable */
      const aseptisations = champsAAseptiser.map((p) =>
        check(p).trim().escape().run(requete)
      );
      await Promise.all(aseptisations);
      suite();
    };
  }
}
