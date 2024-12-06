import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import * as core from 'express-serve-static-core';
import { NextFunction } from 'express-serve-static-core';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ServiceUtilisateur } from '../authentification/ServiceUtilisateur';
import { validateursDeCreationDeMotDePasse } from './validateurs/motDePasse';
import {
  ExpressValidator,
  FieldValidationError,
  Meta,
  Result,
  validationResult,
} from 'express-validator';
import { EntrepotUtilisateur } from '../authentification/Utilisateur';
import { ServiceDeChiffrement } from '../securite/ServiceDeChiffrement';
import { CommandeReinitialisationMotDePasse } from '../authentification/reinitialisation-mot-de-passe/CapteurCommandeReinitialisationMotDePasse';
import { adaptateurConfigurationLimiteurTraffic } from './adaptateurLimiteurTraffic';

type CorpsRequeteReinitialiserMotDePasse = core.ParamsDictionary & {
  token: string;
  motDePasse: string;
  confirmationMotDePasse: string;
};

export type CorpsReponseReinitialiserMotDePasseEnErreur = ReponseHATEOAS & {
  message: string;
};

type CorpsRequeteReinitialisationMotDePasse = core.ParamsDictionary & {
  email: string;
};

export type ReponseReinitialisationMotDePasseEnErreur = ReponseHATEOAS & {
  message: string;
};

const valitateurUtilisateur = (
  entrepotUtilisateur: EntrepotUtilisateur,
  serviceDeChiffrement: ServiceDeChiffrement
) => {
  const { body } = new ExpressValidator({
    utilisateurConnu: async (__: any, { req }: Meta) => {
      const tokenDechiffre = atob(
        serviceDeChiffrement.dechiffre(req.body.token)
      );
      const token = JSON.parse(tokenDechiffre);
      return await entrepotUtilisateur.lis(token.identifiant);
    },
  });

  return body('token')
    .utilisateurConnu()
    .withMessage('L’utilisateur n’est pas connu.');
};

export class ErreurDemandeReinitialisationMotDePasse extends Error {}

export const routesAPIUtilisateur = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const limiteurTrafficReinitialisationMotDePasse =
    adaptateurConfigurationLimiteurTraffic('AUTHENTIFICATION');

  const {
    entrepots,
    adaptateurDeVerificationDeSession: session,
    busCommande,
    busEvenement,
    serviceDeChiffrement,
  } = configuration;

  routes.get(
    '/',
    session.verifie("Accède aux informations de l'utilisateur"),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction
    ) => {
      return entrepots
        .utilisateurs()
        .lis(requete.identifiantUtilisateurCourant!)
        .then((aidant) => {
          const actionsHATEOAS = constructeurActionsHATEOAS();
          // La création de l’espace Aidant est maintenant obsolète
          // Pas besoin de la signature
          reponse.status(200).json({
            ...(aidant.dateSignatureCGU
              ? {
                  ...actionsHATEOAS
                    .accedeAuxInformationsUtilisateur()
                    .construis(),
                }
              : { ...actionsHATEOAS.creerEspaceAidant().construis() }),
            nomPrenom: aidant.nomPrenom,
          });
        })
        .catch((erreur) =>
          suite(
            ErreurMAC.cree("Accède aux informations de l'utilisateur", erreur)
          )
        );
    }
  );

  routes.post(
    '/reinitialisation-mot-de-passe',
    limiteurTrafficReinitialisationMotDePasse,
    express.json(),
    async (
      requete: Request<CorpsRequeteReinitialisationMotDePasse>,
      reponse: Response,
      suite: NextFunction
    ) => {
      return busCommande
        .publie<CommandeReinitialisationMotDePasse, void>({
          type: 'CommandeReinitialisationMotDePasse',
          email: requete.body.email,
        })
        .then(() => reponse.status(202).send())
        .catch((erreur: Error) =>
          suite(
            ErreurMAC.cree(
              'Réinitialisation mot de passe',
              new ErreurDemandeReinitialisationMotDePasse(erreur.message)
            )
          )
        );
    }
  );

  routes.patch(
    '/reinitialiser-mot-de-passe',
    limiteurTrafficReinitialisationMotDePasse,
    express.json(),
    validateursDeCreationDeMotDePasse(),
    valitateurUtilisateur(entrepots.utilisateurs(), serviceDeChiffrement),
    async (
      requete: Request<CorpsRequeteReinitialiserMotDePasse>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          ...constructeurActionsHATEOAS().actionsPubliques().construis(),
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
        });
      }
      const corpsRequete = requete.body;
      return new ServiceUtilisateur(entrepots.utilisateurs(), busEvenement)
        .modifieMotDePasse({
          motDePasse: corpsRequete.motDePasse,
          confirmationMotDePasse: corpsRequete.confirmationMotDePasse,
          token: JSON.parse(
            atob(serviceDeChiffrement.dechiffre(corpsRequete.token))
          ),
        })
        .then(() => reponse.status(204).send())
        .catch((erreur) => suite(erreur));
    }
  );

  return routes;
};
