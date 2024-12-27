import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { body } from 'express-validator';
import { authentifie } from '../authentification/authentification';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { RequeteUtilisateur } from './routesAPI';
import { adaptateurConfigurationLimiteurTraffic } from './adaptateurLimiteurTraffic';
import { UtilisateurAuthentifie } from '../authentification/Utilisateur';
import { unServiceAidant } from '../espace-aidant/ServiceAidantMAC';

export type CorpsRequeteAuthentification = {
  identifiant: string;
  motDePasse: string;
};
export type ReponseAuthentification = ReponseHATEOAS & { nomPrenom: string };

export const routesAPIAuthentification = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const limiteurTrafficAuthentification =
    adaptateurConfigurationLimiteurTraffic('AUTHENTIFICATION');
  const {
    entrepots,
    gestionnaireDeJeton,
    adaptateurDeGestionDeCookies: gestionnaireDeCookies,
  } = configuration;

  routes.post(
    '/',
    limiteurTrafficAuthentification,
    bodyParser.json(),
    body('identifiant').toLowerCase(),
    (
      requete: Request<CorpsRequeteAuthentification>,
      reponse: Response<ReponseAuthentification>,
      suite: NextFunction
    ) => {
      const { identifiant, motDePasse }: CorpsRequeteAuthentification =
        requete.body;
      authentifie(
        entrepots.utilisateurs(),
        gestionnaireDeJeton,
        identifiant,
        motDePasse
      )
        .then((utilisateurAuthentifie: UtilisateurAuthentifie) => {
          let reponseHATEOAS = constructeurActionsHATEOAS()
            .pour({ contexte: 'aidant:acceder-aux-informations-utilisateur' })
            .construis();
          return unServiceAidant(entrepots.aidants())
            .parIdentifiant(utilisateurAuthentifie.identifiant)
            .then((aidant) => {
              if (!aidant?.dateSignatureCGU) {
                reponseHATEOAS = constructeurActionsHATEOAS()
                  .pour({ contexte: 'valider-signature-cgu' })
                  .construis();
              }
              requete.session!.token = utilisateurAuthentifie.jeton;
              return reponse.status(201).json({
                nomPrenom: utilisateurAuthentifie.nomPrenom,
                ...reponseHATEOAS,
              });
            });
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.delete(
    '/',
    gestionnaireDeCookies.supprime(),
    (_requete: RequeteUtilisateur, reponse: Response, _suite: NextFunction) => {
      reponse.status(200);
      return reponse.send();
    }
  );

  return routes;
};
