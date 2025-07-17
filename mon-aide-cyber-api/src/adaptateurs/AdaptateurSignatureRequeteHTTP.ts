import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AdaptateurSignatureRequete } from './AdaptateurSignatureRequete';
import crypto from 'crypto';
import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

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

class FournisseurSignatureLivestorm implements FournisseurSignature {
  verifie(requete: Request): boolean {
    const secretLivestormFinAtelier = adaptateurEnvironnement
      .signatures()
      .livestorm().finAtelier;

    if (!secretLivestormFinAtelier) return false;

    const corpsDeRequete = requete.body;

    const [payloadSignature, payloadTimestamp] = (
      requete.headers['x-livestorm-signature'] as string
    )?.split(',');

    const ageTolere = 5;

    const signatureCalculee = crypto
      .createHash('sha256')
      .update(
        payloadTimestamp +
          secretLivestormFinAtelier +
          JSON.stringify(corpsDeRequete)
      )
      .digest('hex');

    return (
      payloadSignature === signatureCalculee &&
      FournisseurHorloge.maintenant().getTime() / 1000 -
        Number(payloadTimestamp) <=
        ageTolere
    );
  }
}

export class AdaptateurSignatureRequeteHTTP
  implements AdaptateurSignatureRequete
{
  private readonly fournisseursDeSignature: Map<
    NomFournisseur,
    FournisseurSignature
  > = new Map([
    ['TALLY', new FournisseurSignatureTally()],
    ['LIVESTORM', new FournisseurSignatureLivestorm()],
  ]);

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
