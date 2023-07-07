import { ConfigurationServeur } from "../serveur";
import express, { Request, Response } from "express";
import crypto from "crypto";
import { ServiceDiagnostic } from "../diagnostic/ServiceDiagnostic";
import { representeLeDiagnosticPourLeClient } from "./representateurs/representateurDiagnostic";
import { NextFunction } from "express-serve-static-core";

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get(
    "/:id",
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.entrepots,
      )
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json(
            representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur(),
            ),
          ),
        )
        .catch((erreur) => suite(erreur));
    },
  );

  routes.post("/", (_requete: Request, reponse: Response) => {
    new ServiceDiagnostic(
      configuration.adaptateurReferentiel,
      configuration.entrepots,
    )
      .cree()
      .then((diagnostic) => {
        reponse.status(201);
        reponse.appendHeader(
          "Link",
          `${_requete.originalUrl}/${diagnostic.identifiant}`,
        );
        reponse.send();
      });
  });

  return routes;
};
