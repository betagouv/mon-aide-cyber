import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import { AidantAuthentifie } from '../authentification/Aidant';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { body } from 'express-validator';
import { authentifie } from '../authentification/authentification';

export type CorpsAuthentification = { identifiant: string; motDePasse: string };

export const routesAPIAuthentification = (
  configuration: ConfigurationServeur,
) => {
  const routes = express.Router();

  routes.post(
    '/',
    bodyParser.json(),
    body('identifiant').toLowerCase(),
    (
      requete: Request<CorpsAuthentification>,
      reponse: Response,
      suite: NextFunction,
    ) => {
      const { identifiant, motDePasse }: CorpsAuthentification = requete.body;
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
          });
        })
        .catch((erreur) => suite(erreur));
    },
  );

  return routes;
};
