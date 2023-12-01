import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
} from './AdaptateurDeVerificationDeSession';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import { fabriqueDeCookies, MACCookies } from './fabriqueDeCookies';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(private readonly gestionnaireDeJeton: GestionnaireDeJeton) {}

  verifie(
    contexte: Contexte,
    requete: Request,
    reponse: Response,
    suite: NextFunction,
    cookies: MACCookies = fabriqueDeCookies(contexte, requete, reponse),
  ): void {
    try {
      const sessionDecodee = JSON.parse(
        Buffer.from(cookies.session, 'base64').toString(),
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
