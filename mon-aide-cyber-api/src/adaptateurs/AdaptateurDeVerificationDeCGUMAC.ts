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
      const aidant = await this.entrepots
        .aidants()
        .lis(requete.identifiantUtilisateurCourant!);
      if (!aidant.dateSignatureCGU) {
        reponse
          .status(302)
          .json(constructeurActionsHATEOAS().creerEspaceAidant().construis());
      } else {
        suite();
      }
    };
  }
}
