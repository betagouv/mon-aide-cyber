import { ConfigurationServeur } from "../serveur";
import express from "express";
import crypto from "crypto";
import { Diagnostic } from "../diagnostic/Diagnostic";

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

  routes.get("/", (_requete, reponse) => {
    configuration.entrepots
      .diagnostic()
      .tous()
      .then((diagnostics) =>
        reponse.json(
          diagnostics.map((diagnostic) =>
            representeUnElementDeListeDeDiagnosticsPourLeClient(diagnostic),
          ),
        ),
      );
  });
  return routes;
};
