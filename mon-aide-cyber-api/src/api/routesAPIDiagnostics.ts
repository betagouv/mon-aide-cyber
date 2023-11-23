import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { Diagnostic } from '../diagnostic/Diagnostic';
import { NextFunction } from 'express-serve-static-core';

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
    (requete, reponse, suite) =>
      configuration.adaptateurDeVerificationDeSession.verifie(
        requete,
        reponse,
        suite,
      ),
    (_requete: Request, reponse: Response, suite: NextFunction) => {
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
