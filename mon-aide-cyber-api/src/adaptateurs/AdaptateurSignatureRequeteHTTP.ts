import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdaptateurSignatureRequete } from './AdaptateurSignatureRequete';
import crypto from 'crypto';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';

export class AdaptateurSignatureRequeteHTTP
  implements AdaptateurSignatureRequete
{
  verifie(): RequestHandler {
    return (requete: Request, reponse: Response, suite: NextFunction) => {
      const signatureDeRequeteTally = requete.headers['tally-signature'];

      const corpsDeRequete = requete.body;

      const secretSuiviDiagnostic = adaptateurEnvironnement
        .signatures()
        .tally().suiviDiagnostic;

      const calculatedSignature = crypto
        .createHmac('sha256', secretSuiviDiagnostic)
        .update(JSON.stringify(corpsDeRequete))
        .digest('base64');

      if (signatureDeRequeteTally !== calculatedSignature) {
        return reponse
          .status(401)
          .send('La signature pour le suivi du diagnostic est invalide');
      }
      return suite();
    };
  }
}
