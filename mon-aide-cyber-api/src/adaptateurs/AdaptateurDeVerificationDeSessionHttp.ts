import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
} from './AdaptateurDeVerificationDeSession';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(private readonly gestionnaireDeJeton: GestionnaireDeJeton) {}

  verifie(requete: Request, _reponse: Response, suite: NextFunction) {
    const cookie = requete.headers.cookie;

    if (!cookie) {
      throw new ErreurAccesRefuse('Aucun cookie de session trouvé.');
    }

    const matches = cookie.match(/session=(\w+)=/);
    const cookieDeSession = matches ? matches[1] : undefined;

    if (!cookieDeSession) {
      throw new ErreurAccesRefuse(`Cookie de session malformé: '${cookie}'.`);
    }

    const sessionDecodee = JSON.parse(
      Buffer.from(cookieDeSession, 'base64').toString(),
    );

    this.gestionnaireDeJeton.verifie(sessionDecodee.token);

    suite();
  }
}
