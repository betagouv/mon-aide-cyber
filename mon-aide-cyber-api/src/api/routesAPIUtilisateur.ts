import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { ServiceFinalisationCreationCompte } from '../compte/ServiceFinalisationCompte';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import {
  FieldValidationError,
  Result,
  body,
  validationResult,
} from 'express-validator';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurFinalisationCompte } from '../authentification/Aidant';

export type CorpsRequeteFinalisationCompte = {
  cguSignees: boolean;
  motDePasse: string;
};
export const routesAPIUtilisateur = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots, adaptateurDeVerificationDeSession: session } =
    configuration;

  routes.post(
    '/finalise',
    express.json(),
    session.verifie('Finalise la création du compte'),
    body('motDePasse').isStrongPassword({
      minLength: 16,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      try {
        const resultatValidation: Result<FieldValidationError> =
          validationResult(requete) as Result<FieldValidationError>;
        if (resultatValidation.isEmpty()) {
          const finalisationCompte: CorpsRequeteFinalisationCompte =
            requete.body;
          await new ServiceFinalisationCreationCompte(entrepots).finalise({
            ...finalisationCompte,
            identifiant: requete.identifiantUtilisateurCourant!,
          });
          reponse.status(200).json({
            ...constructeurActionsHATEOAS()
              .tableauDeBord()
              .lancerDiagnostic()
              .construis(),
          });
          return reponse.send();
        }
        return suite(
          ErreurMAC.cree(
            'Finalise la création du compte',
            new ErreurFinalisationCompte('Le mot de passe est trop simple.'),
          ),
        );
      } catch (erreur) {
        return suite(erreur);
      }
    },
  );

  return routes;
};
