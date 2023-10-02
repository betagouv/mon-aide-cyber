import { ConfigurationServeur } from "../serveur";
import express from "express";
import * as fs from "fs";
// import crypto from "crypto";
// import { Diagnostic } from "../diagnostic/Diagnostic";

// type CheminAction = string;
// type Action = {
//   [clef: string]: CheminAction;
// };

// type RepresentationClientSimpleDiagnostic = {
//   identifiant: crypto.UUID;
//   actions: Action[];
// };
// const representeUnElementDeListeDeDiagnosticsPourLeClient = (
//   diagnostic: Diagnostic,
// ): RepresentationClientSimpleDiagnostic => {
//   return {
//     actions: [{ details: `/api/diagnostic/${diagnostic.identifiant}` }],
//     identifiant: diagnostic.identifiant,
//   };
// };
export const routesAPIDiagnostics = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get("/", (_requete, reponse) => {
    configuration.entrepots
      .diagnostic()
      .tous()
      .then(
        (__) => reponse.json([]),
        // reponse.json(
        //   diagnostics.map((diagnostic) =>
        //     representeUnElementDeListeDeDiagnosticsPourLeClient(diagnostic),
        //   ),
        // ),
      );
  });

  routes.get("/telecharge", (_requete, reponse) => {
    configuration.entrepots
      .diagnostic()
      .tous()
      .then((diagnostics) => {
        fs.writeFileSync(
          "/tmp/diagnostics.json",
          Buffer.from(JSON.stringify(diagnostics)),
        );
        reponse.download("/tmp/diagnostics.json", "diagnostics.json");
      });
  });
  return routes;
};
