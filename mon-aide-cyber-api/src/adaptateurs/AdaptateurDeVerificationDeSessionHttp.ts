import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
} from './AdaptateurDeVerificationDeSession';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(private readonly gestionnaireDeJeton: GestionnaireDeJeton) {}

  verifie(
    contexte: Contexte,
    requete: Request,
    _reponse: Response,
    suite: NextFunction,
  ): void {
    const cookieSessionValide = requete.headers.cookie
      ?.match(/session=(\w+)=/)
      ?.pop();
    if (!cookieSessionValide) {
      throw ErreurMAC.cree(contexte, new ErreurAccesRefuse('Cookie invalide.'));
    }

    try {
      const sessionDecodee = JSON.parse(
        Buffer.from(cookieSessionValide, 'base64').toString(),
      );
      this.gestionnaireDeJeton.verifie(sessionDecodee.token);
    } catch (e) {
      throw ErreurMAC.cree(
        contexte,
        new ErreurAccesRefuse('Session invalide.'),
      );
    }

    suite();
  }
}
