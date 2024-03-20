import { ConfigurationServeur } from '../../serveur';
import express, { Request, Router, Response } from 'express';
import { SagaDemandeValidationCGUAide } from '../../parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { FieldValidationError, Result, body, validationResult } from 'express-validator';
import { constructeurActionsHATEOAS } from '../hateoas/hateoas';

type CorpsRequeteValidationCGUAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale: string;
};
export const routesAPIAideCGU = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.post(
    '/',
    express.json(),
    body('cguValidees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez signer les CGU'),
    body('email').isEmail().withMessage('Veuillez renseigner votre Email'),
    body('departement')
      .trim()
      .notEmpty()
      .withMessage("Veuillez renseigner le département de l'entité pour laquelle vous sollicitez une aide"),
    body('raisonSociale')
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Veuillez renseigner la raison sociale de l'entité pour laquelle vous sollicitez une aide"),
    async (requete: Request, reponse: Response) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete,
      ) as Result<FieldValidationError>;
      if (resultatValidation.isEmpty()) {
        const corpsRequete: CorpsRequeteValidationCGUAide = requete.body;
        const saga: SagaDemandeValidationCGUAide = {
          type: 'SagaDemandeValidationCGUAide',
          cguValidees: corpsRequete.cguValidees,
          email: corpsRequete.email,
          departement: corpsRequete.departement,
          raisonSociale: corpsRequete.raisonSociale,
        };
        return configuration.busCommande.publie(saga).then(() => {
          reponse.status(202);
          return reponse.send();
        });
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur)
        .join(', ');
      reponse.status(422);
      return reponse.json({
        message: erreursValidation,
        ...constructeurActionsHATEOAS().demanderValidationCGUAide().construis(),
      });
    },
  );

  return routes;
};
