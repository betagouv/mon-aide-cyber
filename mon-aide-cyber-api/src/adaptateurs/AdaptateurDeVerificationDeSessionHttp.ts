import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
} from './AdaptateurDeVerificationDeSession';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import { ParseurCookieSession } from './ParseurCookieSession';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(
    private readonly parseurCookieSession: ParseurCookieSession,
    private readonly gestionnaireDeJeton: GestionnaireDeJeton,
  ) {}

  verifie(
    contexte: Contexte,
    requete: Request,
    _reponse: Response,
    suite: NextFunction,
  ): void {
    const cookie = requete.headers.cookie;

    if (!cookie) {
      throw ErreurMAC.cree(
        contexte,
        new ErreurAccesRefuse('Cookie de session invalide.'),
      );
    }

    try {
      const session = this.parseurCookieSession.parse(cookie);
      this.gestionnaireDeJeton.verifie(session.token);
    } catch (e) {
      throw ErreurMAC.cree(
        contexte,
        new ErreurAccesRefuse('Cookie de session invalide.'),
      );
    }

    suite();
  }
}
