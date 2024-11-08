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

type CorpsRequeteReinitialiserMotDePasse = core.ParamsDictionary & {
  token: string;
  motDePasse: string;
  confirmationMotDePasse: string;
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
      const token = JSON.parse(
        serviceDeChiffrement.dechiffre(atob(req.body.token))
      );
      return await entrepotUtilisateur.lis(token.identifiant);
    },
  });

  return body('token')
    .utilisateurConnu()
    .withMessage('L’utilisateur n’est pas connu.');
};
export const routesAPIUtilisateur = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const {
    entrepots,
    adaptateurDeVerificationDeSession: session,
    busCommande,
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
    express.json(),
    async (
      requete: Request<CorpsRequeteReinitialisationMotDePasse>,
      reponse: Response
    ) => {
      return busCommande
        .publie<CommandeReinitialisationMotDePasse, void>({
          type: 'CommandeReinitialisationMotDePasse',
          email: requete.body.email,
        })
        .then(() => reponse.status(202).send())
        .catch(() => reponse.status(202).send());
    }
  );

  routes.patch(
    '/reinitialiser-mot-de-passe',
    express.json(),
    validateursDeCreationDeMotDePasse(),
    valitateurUtilisateur(entrepots.utilisateurs(), serviceDeChiffrement),
    async (
      requete: Request<CorpsRequeteReinitialiserMotDePasse>,
      reponse: Response,
      _suite: NextFunction
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
      return new ServiceUtilisateur(entrepots.utilisateurs())
        .modifieMotDePasse({
          motDePasse: corpsRequete.motDePasse,
          confirmationMotDePasse: corpsRequete.confirmationMotDePasse,
          token: JSON.parse(
            serviceDeChiffrement.dechiffre(atob(corpsRequete.token))
          ),
        })
        .then(() => reponse.status(204).send());
    }
  );

  return routes;
};
