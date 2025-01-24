import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import * as core from 'express-serve-static-core';
import { NextFunction } from 'express-serve-static-core';
import {
  constructeurActionsHATEOAS,
  ReponseHATEOAS,
  ReponseHATEOASEnErreur,
} from './hateoas/hateoas';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ServiceUtilisateur } from '../authentification/ServiceUtilisateur';
import { validateursDeCreationDeMotDePasse } from './validateurs/motDePasse';
import {
  body,
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
import { unServiceAidant } from '../espace-aidant/ServiceAidantMAC';
import {
  uneRechercheUtilisateursMAC,
  UtilisateurMACDTO,
} from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  dateNouveauParcoursAidant,
  estDateNouveauParcoursDemandeDevenirAidant,
} from '../gestion-demandes/devenir-aidant/nouveauParcours';
import { isAfter } from 'date-fns';

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

export class ErreurUtilisateurNonTrouve extends Error {
  constructor() {
    super('Utilisateur non trouvé.');
  }
}

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
      const reponseOK = (
        actions: ReponseHATEOAS,
        utilisateur: UtilisateurMACDTO
      ) =>
        reponse.status(200).json({
          ...actions,
          nomPrenom: utilisateur.nomComplet,
        });

      return uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
        .rechercheParIdentifiant(requete.identifiantUtilisateurCourant!)
        .then((utilisateur) => {
          if (!utilisateur) {
            return suite(
              ErreurMAC.cree(
                "Accède aux informations de l'utilisateur",
                new ErreurUtilisateurNonTrouve()
              )
            );
          }
          const deconnexionUtilisateur = {
            contexte: requete.estProConnect
              ? 'se-deconnecter-avec-pro-connect'
              : 'se-deconnecter',
          };
          if (!utilisateur.dateValidationCGU) {
            return reponseOK(
              constructeurActionsHATEOAS()
                .pour({ contexte: 'valider-signature-cgu' })
                .construis(),
              utilisateur
            );
          }
          if (
            utilisateur.dateValidationCGU &&
            estDateNouveauParcoursDemandeDevenirAidant() &&
            isAfter(dateNouveauParcoursAidant(), utilisateur.dateValidationCGU)
          ) {
            return reponseOK(
              constructeurActionsHATEOAS()
                .pour({ contexte: 'valider-profil' })
                .pour(deconnexionUtilisateur)
                .construis(),
              utilisateur
            );
          }
          return reponseOK(
            constructeurActionsHATEOAS()
              .pour({
                contexte:
                  utilisateur.profil === 'UtilisateurInscrit'
                    ? 'utilisateur-inscrit:acceder-aux-informations-utilisateur'
                    : 'aidant:acceder-aux-informations-utilisateur',
              })
              .pour(deconnexionUtilisateur)
              .construis(),
            utilisateur
          );
        });
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

  routes.post(
    '/valider-signature-cgu',
    session.verifie('Valide les CGU'),
    express.json(),
    body('cguValidees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez valider les CGU'),
    async (
      requete: RequeteUtilisateur,
      reponse: Response<ReponseHATEOAS | ReponseHATEOASEnErreur>
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
          ...constructeurActionsHATEOAS()
            .pour({ contexte: 'valider-signature-cgu' })
            .construis(),
        });
      }
      return unServiceAidant(entrepots.aidants())
        .valideLesCGU(requete.identifiantUtilisateurCourant!)
        .then(() =>
          reponse.status(200).json({
            ...constructeurActionsHATEOAS()
              .pour({
                contexte: requete.estProConnect
                  ? 'aidant:pro-connect-acceder-au-profil'
                  : 'aidant:acceder-au-profil',
              })
              .construis(),
          })
        );
    }
  );

  return routes;
};
