import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response, Router } from 'express';
import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { constructeurActionsHATEOAS } from '../hateoas/hateoas';
import { NextFunction } from 'express-serve-static-core';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { SagaDemandeAide } from '../../gestion-demandes/aide/CapteurSagaDemandeAide';
import {
  nomsEtCodesDesDepartements,
  rechercheParNomDepartement,
} from '../../gestion-demandes/departements';
import { RequetePublique } from '../routesAPI';

type CorpsRequeteDemandeAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

class ErreurDemandeAide extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export const routesAPIDemandeEtreAide = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();

  routes.get('/', async (_requete: Request, reponse: Response) => {
    return reponse.status(200).json({
      ...constructeurActionsHATEOAS().demandeAide().construis(),
      departements: nomsEtCodesDesDepartements(),
    });
  });

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
      .withMessage(
        "Veuillez renseigner le département de l'entité pour laquelle vous sollicitez une aide"
      ),
    body('raisonSociale')
      .optional()
      .trim()
      .notEmpty()
      .withMessage(
        "Veuillez renseigner la raison sociale de l'entité pour laquelle vous sollicitez une aide"
      ),
    async (
      requete: RequetePublique<CorpsRequeteDemandeAide>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete
      ) as Result<FieldValidationError>;
      if (resultatValidation.isEmpty()) {
        const corpsRequete = requete.body;
        const saga: SagaDemandeAide = {
          type: 'SagaDemandeAide',
          cguValidees: corpsRequete.cguValidees,
          email: corpsRequete.email,
          departement: rechercheParNomDepartement(corpsRequete.departement),
          ...(corpsRequete.raisonSociale && {
            raisonSociale: corpsRequete.raisonSociale,
          }),
          relationAidant: corpsRequete.relationAidant,
        };
        return configuration.busCommande
          .publie(saga)
          .then(() => {
            reponse.status(202);
            return reponse.send();
          })
          .catch((erreur) =>
            suite(
              ErreurMAC.cree("Demande d'aide", new ErreurDemandeAide(erreur))
            )
          );
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur)
        .join(', ');
      reponse.status(422);
      return reponse.json({
        message: erreursValidation,
        ...constructeurActionsHATEOAS().demandeAide().construis(),
      });
    }
  );

  return routes;
};
