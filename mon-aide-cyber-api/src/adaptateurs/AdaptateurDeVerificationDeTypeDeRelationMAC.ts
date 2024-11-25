import { NextFunction, Request, RequestHandler, Response } from 'express';
import { DefinitionTuple } from '../relation/Tuple';
import { AdaptateurDeVerificationDeTypeDeRelation } from './AdaptateurDeVerificationDeTypeDeRelation';
import { AdaptateurRelationsMAC } from '../relation/AdaptateurRelationsMAC';

export class AdaptateurDeVerificationDeTypeDeRelationMAC
  implements AdaptateurDeVerificationDeTypeDeRelation
{
  constructor(private readonly adaptateurRelations: AdaptateurRelationsMAC) {}

  verifie<DEFINITION extends DefinitionTuple>(
    definition: DEFINITION
  ): RequestHandler {
    return (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      return this.adaptateurRelations
        .typeRelationExiste(definition.relation, {
          type: definition.typeObjet,
          identifiant: id,
        })
        .then((existe) => {
          if (existe) {
            return suite();
          }
          return reponse.status(404).json({
            titre: 'Diagnostic non trouvé.',
            message: 'Désolé, vous ne pouvez pas accéder à ce diagnostic.',
            liens: {
              'creer-auto-diagnostic': {
                url: '/api/auto-diagnostic',
                methode: 'POST',
              },
            },
          });
        });
    };
  }
}
