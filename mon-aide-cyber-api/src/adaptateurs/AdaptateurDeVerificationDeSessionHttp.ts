import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
} from './AdaptateurDeVerificationDeSession';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import { fabriqueDeCookies, MACCookies } from './fabriqueDeCookies';
import { RequeteUtilisateur } from '../api/routesAPI';

export class AdaptateurDeVerificationDeSessionHttp
  implements AdaptateurDeVerificationDeSession
{
  constructor(private readonly gestionnaireDeJeton: GestionnaireDeJeton) {}

  verifie(
    contexte: Contexte,
    fabriqueLesCookies: (
      contexte: Contexte,
      requete: Request,
      reponse: Response,
    ) => MACCookies = (contexte, requete, reponse) =>
      fabriqueDeCookies(contexte, requete, reponse),
  ): RequestHandler {
    return (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      try {
        const cookies: MACCookies = fabriqueLesCookies(
          contexte,
          requete,
          reponse,
        );
        const sessionDecodee = JSON.parse(
          Buffer.from(cookies.session, 'base64').toString(),
        );
        const jwtPayload = this.gestionnaireDeJeton.verifie(
          sessionDecodee.token,
        );
        requete.identifiantUtilisateurCourant = jwtPayload.identifiant;
      } catch (e) {
        throw ErreurMAC.cree(
          contexte,
          e instanceof ErreurMAC
            ? e
            : new ErreurAccesRefuse('Session invalide.'),
        );
      }

      suite();
    };
  }
}
