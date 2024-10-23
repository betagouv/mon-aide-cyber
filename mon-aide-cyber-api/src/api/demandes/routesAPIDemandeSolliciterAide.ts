import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response, Router } from 'express';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ReponseHATEOAS } from '../hateoas/hateoas';
import { EntrepotAidant } from '../../authentification/Aidant';
import {
  ExpressValidator,
  FieldValidationError,
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

const validateurAidant = (entrepotAidant: EntrepotAidant) => {
  const { body } = new ExpressValidator({
    aidantConnu: async (identifiant: string) =>
      await entrepotAidant.lis(identifiant),
  });
  return body('aidantSollicite')
    .aidantConnu()
    .withMessage('L’Aidant demandé n’existe pas.');
};
export const routesAPIDemandeSolliciterAide = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();
  const { entrepots, busCommande } = configuration;

  routes.post(
    '/',
    express.json(),
    validateurAidant(entrepots.aidants()),
    validateurDeDepartement({
      emplacement: 'CORPS',
      presence: 'OPTIONELLE',
      nomChamp: 'departement',
    }),
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
      const corps = requete.body;
      const saga: SagaDemandeSolliciterAide = {
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: corps.email,
        departement: corps.departement,
        type: 'SagaDemandeSolliciterAide',
      };
      return busCommande
        .publie<SagaDemandeSolliciterAide, void>(saga)
        .then(() => reponse.status(202).send());
    }
  );

  return routes;
};
