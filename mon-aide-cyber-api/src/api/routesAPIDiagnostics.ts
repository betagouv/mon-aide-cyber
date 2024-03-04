import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import crypto from 'crypto';
import { Diagnostic } from '../diagnostic/Diagnostic';
import { NextFunction } from 'express-serve-static-core';
import { RequeteUtilisateur } from './routesAPI';
import { OpenFgaClient } from '@openfga/sdk';

type CheminAction = string;
type Action = {
  [clef: string]: CheminAction;
};

type RepresentationClientSimpleDiagnostic = {
  identifiant: crypto.UUID;
  actions: Action[];
};
const representeUnElementDeListeDeDiagnosticsPourLeClient = (
  diagnostic: Diagnostic,
): RepresentationClientSimpleDiagnostic => {
  return {
    actions: [{ details: `/api/diagnostic/${diagnostic.identifiant}` }],
    identifiant: diagnostic.identifiant,
  };
};

export const routesAPIDiagnostics = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get(
    '/',
    configuration.adaptateurDeVerificationDeSession.verifie(
      'Accède aux diagnostics',
    ),
    async (requete: RequeteUtilisateur, _: Response, suite: NextFunction) => {
      if (
        process.env.MAC_MOTEUR_PERMISSIONS_URL &&
        process.env.MAC_MOTEUR_ENTREPOT_ID &&
        process.env.MAC_MOTEUR_PERMISSIONS_MODELES_ID
      ) {
        const fgaClient = new OpenFgaClient({
          apiUrl: process.env.MAC_MOTEUR_PERMISSIONS_URL!,
          storeId: process.env.MAC_MOTEUR_PERMISSIONS_ENTREPOT_ID!,
          authorizationModelId: process.env.MAC_MOTEUR_PERMISSIONS_MODELE_ID!,
        });
        const reponseFga = await fgaClient.listObjects({
          user: `aidant:${requete.identifiantUtilisateurCourant}`,
          relation: 'createur',
          type: 'diagnostic',
        });

        console.log('diagnostics accessibles: ', reponseFga.objects);
      }

      suite();
    },
    (_requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      configuration.entrepots
        .diagnostic()
        .tous()
        .then((diagnostics) =>
          reponse.json(
            diagnostics.map((diagnostic) =>
              representeUnElementDeListeDeDiagnosticsPourLeClient(diagnostic),
            ),
          ),
        )
        .catch((erreur) => suite(erreur));
    },
  );
  return routes;
};
