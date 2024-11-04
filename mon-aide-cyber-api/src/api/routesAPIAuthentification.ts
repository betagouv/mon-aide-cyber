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
        configuration.entrepots.utilisateurs(),
        configuration.gestionnaireDeJeton,
        identifiant,
        motDePasse
      )
        .then((utilisateurAuthentifie: UtilisateurAuthentifie) => {
          requete.session!.token = utilisateurAuthentifie.jeton;
          reponse.status(201).json({
            nomPrenom: utilisateurAuthentifie.nomPrenom,
            ...constructeurActionsHATEOAS()
              .postAuthentification(utilisateurAuthentifie)
              .construis(),
          });
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.delete(
    '/',
    (requete: RequeteUtilisateur, reponse: Response, _suite: NextFunction) => {
      configuration.adaptateurDeGestionDeCookies.supprime(requete, reponse);
      reponse.status(200);
      return reponse.send();
    }
  );

  return routes;
};
