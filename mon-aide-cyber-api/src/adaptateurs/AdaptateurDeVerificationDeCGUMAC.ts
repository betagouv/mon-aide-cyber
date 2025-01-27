import { RequestHandler, Response } from 'express';
import {
  AdaptateurDeVerificationDeCGU,
  UtilisateurNonTrouve,
} from './AdaptateurDeVerificationDeCGU';
import { Entrepots } from '../domaine/Entrepots';
import { RequeteUtilisateur } from '../api/routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { constructeurActionsHATEOAS } from '../api/hateoas/hateoas';
import { uneRechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

export class AdaptateurDeVerificationDeCGUMAC
  implements AdaptateurDeVerificationDeCGU
{
  constructor(private readonly entrepots: Entrepots) {}

  verifie<T>(): RequestHandler {
    return async (
      requete: RequeteUtilisateur<T>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const aidant = await uneRechercheUtilisateursMAC(
        this.entrepots.utilisateursMAC()
      ).rechercheParIdentifiant(requete.identifiantUtilisateurCourant!);
      if (!aidant) {
        throw new UtilisateurNonTrouve();
      }
      if (aidant.doitValiderLesCGU) {
        reponse
          .status(302)
          .json(
            constructeurActionsHATEOAS()
              .pour({ contexte: 'valider-signature-cgu' })
              .construis()
          );
      } else {
        suite();
      }
    };
  }
}
