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
import {
  ErreurDemandeAideEntrepriseInconnue,
  ErreurUtilisateurMACInconnu,
  SagaDemandeAide,
} from '../../gestion-demandes/aide/CapteurSagaDemandeAide';
import {
  departements,
  nomsEtCodesDesDepartements,
  rechercheParNomOuCodeDepartement,
} from '../../gestion-demandes/departements';
import { RequetePublique } from '../routesAPI';
import crypto from 'crypto';

type CorpsRequeteDemandeAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationUtilisateur?: string;
  identifiantAidant?: crypto.UUID;
  siret: string;
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
    body('siret')
      .matches(/^\d{14}$/)
      .withMessage('Veuillez renseigner un SIRET valide.'),
    body('departement')
      .trim()
      .notEmpty()
      .withMessage(
        "Veuillez renseigner le département de l'entité pour laquelle vous sollicitez une aide"
      ),
    body('departement')
      .isIn([
        ...departements.map((d) => d.nom),
        ...departements.map((d) => d.code),
      ])
      .withMessage('Département inconnu'),
    body('raisonSociale')
      .optional()
      .trim()
      .notEmpty()
      .withMessage(
        "Veuillez renseigner la raison sociale de l'entité pour laquelle vous sollicitez une aide"
      ),
    body('relationUtilisateur')
      .optional()
      .isEmail()
      .withMessage(
        "Veuillez renseigner un email valide pour l'utilisateur avec qui vous êtes en relation."
      ),
    body('identifiantAidant')
      .optional()
      .isUUID()
      .withMessage('Veuillez renseigner un identifiant Aidant valide.'),
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
        const departement = rechercheParNomOuCodeDepartement(
          corpsRequete.departement
        );
        const saga: SagaDemandeAide = {
          type: 'SagaDemandeAide',
          cguValidees: corpsRequete.cguValidees,
          email: corpsRequete.email,
          departement,
          ...(corpsRequete.raisonSociale && {
            raisonSociale: corpsRequete.raisonSociale,
          }),
          ...(corpsRequete.relationUtilisateur && {
            relationUtilisateur: corpsRequete.relationUtilisateur,
          }),
          ...(corpsRequete.identifiantAidant && {
            identifiantAidant: corpsRequete.identifiantAidant,
          }),
          siret: corpsRequete.siret,
        };
        return configuration.busCommande
          .publie(saga)
          .then(() => reponse.status(202).send())
          .catch(
            (
              erreur:
                | string
                | ErreurUtilisateurMACInconnu
                | ErreurDemandeAideEntrepriseInconnue
            ) => {
              if (
                erreur instanceof ErreurUtilisateurMACInconnu ||
                erreur instanceof ErreurDemandeAideEntrepriseInconnue
              ) {
                suite(ErreurMAC.cree("Demande d'aide", erreur));
              }
              suite(
                ErreurMAC.cree(
                  "Demande d'aide",
                  new ErreurDemandeAide(erreur as string)
                )
              );
            }
          );
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur)
        .join(', ');
      return reponse.status(422).json({
        message: erreursValidation,
        ...constructeurActionsHATEOAS().demandeAide().construis(),
      });
    }
  );

  return routes;
};
