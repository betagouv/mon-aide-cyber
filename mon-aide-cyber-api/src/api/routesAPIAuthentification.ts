import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { AidantAuthentifie } from '../authentification/Aidant';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { body } from 'express-validator';
import { authentifie } from '../authentification/authentification';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { RequeteUtilisateur } from './routesAPI';

export type CorpsRequeteAuthentification = {
  identifiant: string;
  motDePasse: string;
};
export type ReponseAuthentification = ReponseHATEOAS & { nomPrenom: string };

export const routesAPIAuthentification = (
  configuration: ConfigurationServeur,
) => {
  const routes = express.Router();

  routes.post(
    '/',
    bodyParser.json(),
    body('identifiant').toLowerCase(),
    (
      requete: Request<CorpsRequeteAuthentification>,
      reponse: Response<ReponseAuthentification>,
      suite: NextFunction,
    ) => {
      const { identifiant, motDePasse }: CorpsRequeteAuthentification =
        requete.body;
      authentifie(
        configuration.entrepots.aidants(),
        configuration.gestionnaireDeJeton,
        identifiant,
        motDePasse,
      )
        .then((aidantAuthentifie: AidantAuthentifie) => {
          requete.session!.token = aidantAuthentifie.jeton;
          reponse.status(201).json({
            nomPrenom: aidantAuthentifie.nomPrenom,
            ...constructeurActionsHATEOAS()
              .postAuthentification(aidantAuthentifie)
              .construis(),
          });
        })
        .catch((erreur) => suite(erreur));
    },
  );

  routes.delete(
    '/',
    (requete: RequeteUtilisateur, reponse: Response, _suite: NextFunction) => {
      configuration.adaptateurDeGestionDeCookies.supprime(requete, reponse);
      reponse.status(200);
      return reponse.send();
    },
  );

  return routes;
};
