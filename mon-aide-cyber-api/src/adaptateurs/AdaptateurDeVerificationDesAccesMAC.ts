import { AdaptateurDeVerificationDesAcces } from './AdaptateurDeVerificationDesAcces';
import { Relation } from '../relation/Tuple';
import {
  ConstructeurObjet,
  ConstructeurUtilisateur,
} from '../definition-type/relations';
import { RequestHandler, Response } from 'express';
import { RequeteUtilisateur } from '../api/routesAPI';
import { NextFunction } from 'express-serve-static-core';
import {
  constructeurActionsHATEOAS,
  ReponseHATEOAS,
} from '../api/hateoas/hateoas';
import { AdaptateurRelations } from '../relation/AdaptateurRelations';

export type ReponseVerificationRelationEnErreur = ReponseHATEOAS & {
  titre: string;
  message: string;
};

export class AdaptateurDeVerificationDesAccesMAC
  implements AdaptateurDeVerificationDesAcces
{
  constructor(private readonly adaptateurRelation: AdaptateurRelations) {}

  verifie(
    relation: Relation,
    utilisateur: typeof ConstructeurUtilisateur,
    objet: typeof ConstructeurObjet,
  ): RequestHandler {
    return async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      const { id } = requete.params;
      const relationExiste = await this.adaptateurRelation.relationExiste(
        relation,
        utilisateur
          .avecIdentifiant(requete.identifiantUtilisateurCourant!)
          .construis(),
        objet.avecIdentifiant(id).construis(),
      );
      if (!relationExiste) {
        reponse.status(403).json({
          titre: 'Accès non autorisé',
          message: 'Désolé, vous ne pouvez pas accéder à ce diagnostic.',
          ...constructeurActionsHATEOAS()
            .actionsAccesDiagnosticNonAutorise()
            .construis(),
        });
      } else {
        suite();
      }
    };
  }
}
