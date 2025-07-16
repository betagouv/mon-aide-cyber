import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdaptateurSignatureRequete } from './AdaptateurSignatureRequete';
import crypto from 'crypto';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';

interface FournisseurSignature {
  verifie(requete: Request): boolean;
}

type NomFournisseur = 'TALLY' | 'LIVESTORM';

class FournisseurSignatureTally implements FournisseurSignature {
  verifie(requete: Request): boolean {
    const signatureDeRequeteTally = requete.headers['tally-signature'];

    const corpsDeRequete = requete.body;

    const secretSuiviDiagnostic = adaptateurEnvironnement
      .signatures()
      .tally().suiviDiagnostic;

    const calculatedSignature = crypto
      .createHmac('sha256', secretSuiviDiagnostic)
      .update(JSON.stringify(corpsDeRequete))
      .digest('base64');

    return signatureDeRequeteTally === calculatedSignature;
  }
}

export class AdaptateurSignatureRequeteHTTP
  implements AdaptateurSignatureRequete
{
  private readonly fournisseursDeSignature: Map<
    NomFournisseur,
    FournisseurSignature
  > = new Map([['TALLY', new FournisseurSignatureTally()]]);

  verifie(fournisseur: NomFournisseur): RequestHandler {
    return (requete: Request, reponse: Response, suite: NextFunction) => {
      const correspond = this.fournisseursDeSignature
        .get(fournisseur)
        ?.verifie(requete);
      if (!correspond) {
        return reponse.status(401).send('La signature est invalide');
      }
      return suite();
    };
  }
}
