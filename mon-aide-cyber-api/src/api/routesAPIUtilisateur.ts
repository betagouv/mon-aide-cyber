import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { ServiceFinalisationCreationCompte } from '../compte/ServiceFinalisationCompte';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import {
  ExpressValidator,
  FieldValidationError,
  Meta,
  Result,
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

  routes.post(
    '/finalise',
    express.json(),
    session.verifie('Finalise la création du compte'),
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
        const erreursValidation = resultatValidation
          .array()
          .map((resultat) => resultat.msg)
          .filter((erreur): erreur is string => !!erreur);
        return suite(
          ErreurMAC.cree(
            'Finalise la création du compte',
            new ErreurFinalisationCompte(erreursValidation.join('\n')),
          ),
        );
      } catch (erreur) {
        return suite(erreur);
      }
    },
  );

  return routes;
};
