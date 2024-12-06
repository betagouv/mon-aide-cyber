import { RequestHandler, Response } from 'express';
import { AdaptateurDeVerificationDeCGU } from './AdaptateurDeVerificationDeCGU';
import { Entrepots } from '../domaine/Entrepots';
import { RequeteUtilisateur } from '../api/routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { constructeurActionsHATEOAS } from '../api/hateoas/hateoas';

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
      // CQRS : Ecrire un service capable d’aller chercher l’info
      // la date de signature CGU est utilisée pour rediriger vers la création de l’espace Aidant devenue obsolète
      const utilisateur = await this.entrepots
        .utilisateurs()
        .lis(requete.identifiantUtilisateurCourant!);
      if (!utilisateur.dateSignatureCGU) {
        reponse
          .status(302)
          .json(constructeurActionsHATEOAS().creerEspaceAidant().construis());
      } else {
        suite();
      }
    };
  }
}
