import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { Aidant, authentifie } from '../authentification/Aidant';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';

export const routesAPIAuthentification = (
  configuration: ConfigurationServeur,
) => {
  const routes = express.Router();

  routes.post(
    '/',
    bodyParser.json(),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { identifiant, motDePasse } = requete.body;
      authentifie(configuration.entrepots.aidants(), identifiant, motDePasse)
        .then((aidant: Aidant) => {
          reponse.status(201).json({
            nomPrenom: aidant.nomPrenom,
          });
        })
        .catch((erreur) => suite(erreur));
    },
  );

  return routes;
};
