import { GestionnaireDeJeton } from '../authentification/GestionnaireDeJeton';
import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  AdaptateurDeVerificationDeSession,
  ErreurAccesRefuse,
  InformationsContexte,
} from './AdaptateurDeVerificationDeSession';
import { Contexte, ErreurMAC } from '../domaine/erreurMAC';
import { MACCookies, utilitairesCookies } from './utilitairesDeCookies';
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
      reponse: Response
    ) => MACCookies = (contexte, requete, reponse) =>
      utilitairesCookies.fabriqueDeCookies(contexte, requete, reponse)
  ): RequestHandler {
    return (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      try {
        const cookies: MACCookies = fabriqueLesCookies(
          contexte,
          requete,
          reponse
        );
        const jwtPayload = utilitairesCookies.jwtPayload(
          cookies,
          this.gestionnaireDeJeton
        );
        requete.identifiantUtilisateurCourant = jwtPayload.identifiant;
        requete.estProConnect = jwtPayload.estProconnect;
      } catch (e) {
        throw ErreurMAC.cree(
          contexte,
          e instanceof ErreurMAC
            ? e.erreurOriginelle
            : new ErreurAccesRefuse(
                'Session invalide.',
                requete.query as InformationsContexte
              )
        );
      }

      suite();
    };
  }

  recupereUtilisateurConnecte(contexte: Contexte): RequestHandler {
    return (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      try {
        return this.verifie(contexte)(requete, reponse, suite);
      } catch (__e) {
        return suite();
      }
    };
  }
}
