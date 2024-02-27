import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import {
  ExpressValidator,
  FieldValidationError,
  Meta,
  Result,
} from 'express-validator';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { ServiceCreationEspaceAidant } from '../espace-aidant/ServiceCreationEspaceAidant';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurCreationEspaceAidant } from '../authentification/Aidant';

export const routesAPIEspaceAidant = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots, adaptateurDeVerificationDeSession: session } =
    configuration;

  const { body, validationResult } = new ExpressValidator({
    motDePasseTemporaireDifferentDuNouveauMotDePasse: (
      value: string,
      { req }: Meta,
    ) => value !== req.body.motDePasse,
    motDePasseUtilisateur: async (value: string, { req }: Meta) => {
      const aidant = await entrepots
        .aidants()
        .lis(req.identifiantUtilisateurCourant);
      if (aidant.motDePasse !== value) {
        throw new Error('Votre mot de passe temporaire est erroné.');
      }
      return true;
    },
  });

  type CorpsRequeteCreationEspaceAidant = {
    cguSignees: boolean;
    motDePasse: string;
  };

  routes.post(
    '/cree',
    express.json(),
    session.verifie("Crée l'espace Aidant"),
    body('motDePasse')
      .isStrongPassword({
        minLength: 16,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Votre nouveau mot de passe ne respecte pas les règles de MonAideCyber.',
      ),
    body('motDePasseTemporaire')
      .notEmpty()
      .withMessage('Le mot de passe temporaire est obligatoire.')
      .motDePasseTemporaireDifferentDuNouveauMotDePasse()
      .withMessage(
        'Votre nouveau mot de passe doit être différent du mot de passe temporaire.',
      )
      .motDePasseUtilisateur(),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      try {
        const resultatValidation: Result<FieldValidationError> =
          validationResult(requete) as Result<FieldValidationError>;
        if (resultatValidation.isEmpty()) {
          const creationEspaceAidant: CorpsRequeteCreationEspaceAidant =
            requete.body;
          await new ServiceCreationEspaceAidant(entrepots).cree({
            ...creationEspaceAidant,
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
        const erreursValidation = resultatValidation
          .array()
          .map((resultat) => resultat.msg)
          .filter((erreur): erreur is string => !!erreur);
        return suite(
          ErreurMAC.cree(
            "Crée l'espace Aidant",
            new ErreurCreationEspaceAidant(erreursValidation.join('\n')),
          ),
        );
      } catch (erreur) {
        suite(erreur);
      }
    },
  );

  return routes;
};
