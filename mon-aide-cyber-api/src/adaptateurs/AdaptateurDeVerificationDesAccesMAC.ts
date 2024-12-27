import { AdaptateurDeVerificationDesAcces } from './AdaptateurDeVerificationDesAcces';
import { DefinitionTuple } from '../relation/Tuple';
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

  verifie<DEFINITION extends DefinitionTuple, T>(
    definition: DEFINITION
  ): RequestHandler {
    return async (
      requete: RequeteUtilisateur<T>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const { id } = requete.params;
      const relationExiste = await this.adaptateurRelation.relationExiste(
        definition.relation,
        {
          identifiant: requete.identifiantUtilisateurCourant!,
          type: definition.typeUtilisateur,
        },
        { identifiant: id, type: definition.typeObjet }
      );
      if (!relationExiste) {
        reponse.status(403).json({
          titre: 'Accès non autorisé',
          message: 'Désolé, vous ne pouvez pas accéder à ce diagnostic.',
          ...constructeurActionsHATEOAS()
            .pour({ contexte: 'aidant:acceder-aux-informations-utilisateur' })
            .pour({ contexte: 'se-deconnecter' })
            .construis(),
        });
      } else {
        suite();
      }
    };
  }
}
