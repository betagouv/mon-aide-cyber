import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response, Router } from 'express';
import crypto from 'crypto';
import { ReponseHATEOAS } from '../hateoas/hateoas';
import { EntrepotAidant } from '../../authentification/Aidant';
import {
  ExpressValidator,
  FieldValidationError,
  Meta,
  Result,
  validationResult,
} from 'express-validator';
import { validateurDeDepartement } from '../validateurs/departements';
import { SagaDemandeSolliciterAide } from '../../gestion-demandes/aide/CapteurSagaDemandeSolliciterAide';

type CorpsRequeteDemandeSolliciterAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale: string;
  aidantSollicite: crypto.UUID;
};

export type ReponseDemandeSolliciterAideEnErreur = ReponseHATEOAS & {
  message: string;
};

const validateurSollicitation = (entrepotAidant: EntrepotAidant) => {
  const { body } = new ExpressValidator({
    aidantConnu: async (identifiant: string, { req }: Meta) =>
      entrepotAidant.lis(identifiant).then((aidant) => {
        if (
          !aidant.preferences.departements.some(
            (d) => d.nom === req.body.departement
          )
        ) {
          throw new Error('L’Aidant n’intervient pas sur ce département.');
        }
        return aidant;
      }),
  });
  return [validateurDeDepartement(), body('aidantSollicite').aidantConnu()];
};
export const routesAPIDemandeSolliciterAide = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();
  const { entrepots, busCommande } = configuration;

  routes.post(
    '/',
    express.json(),
    validateurSollicitation(entrepots.aidants()),
    async (
      requete: Request<CorpsRequeteDemandeSolliciterAide>,
      reponse: Response<ReponseDemandeSolliciterAideEnErreur>,
      _suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join('\n'),
          liens: {
            'solliciter-aide': {
              methode: 'POST',
              url: '/api/demandes/solliciter-aide',
            },
          },
        });
      }
      const corps: CorpsRequeteDemandeSolliciterAide = requete.body;
      const saga: SagaDemandeSolliciterAide = {
        email: corps.email,
        departement: corps.departement,
        identifiantAidant: corps.aidantSollicite,
        type: 'SagaDemandeSolliciterAide',
      };
      return busCommande
        .publie<SagaDemandeSolliciterAide, void>(saga)
        .then(() => reponse.status(202).send());
    }
  );

  return routes;
};
