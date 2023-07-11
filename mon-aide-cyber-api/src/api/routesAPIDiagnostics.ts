import { ConfigurationServeur } from "../serveur";
import express from "express";
import { Diagnostique } from "../diagnostique/Diagnostique";
import crypto from "crypto";

type CheminAction = string;
type Action = {
  [clef: string]: CheminAction;
};

type RepresentationClientSimpleDiagnostic = {
  identifiant: crypto.UUID;
  actions: Action[];
};
const representeUnElementDeListeDeDiagnosticsPourLeClient = (
  diagnostic: Diagnostique,
): RepresentationClientSimpleDiagnostic => {
  return {
    actions: [{ details: `/api/diagnostique/${diagnostic.identifiant}` }],
    identifiant: diagnostic.identifiant,
  };
};
export const routesAPIDiagnostics = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get("/", (_requete, reponse) => {
    configuration.entrepots
      .diagnostique()
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
