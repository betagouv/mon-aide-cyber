import { ConfigurationServeur } from "../serveur";
import express, { Request, Response } from "express";
import { EntrepotsMemoire } from "../infrastructure/entrepots/memoire/Entrepots";
import crypto from "crypto";
import { ServiceDiagnostic } from "../diagnostic/ServiceDiagnostic";
import { representeLeDiagnosticPourLeClient } from "./representateurs/representateurDiagnostic";

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get("/:id", (requete: Request, reponse: Response) => {
    const { id } = requete.params;
    new ServiceDiagnostic(
      configuration.adaptateurReferentiel,
      new EntrepotsMemoire(),
    )
      .diagnostic(id as crypto.UUID)
      .then((diagnostic) =>
        reponse.json(
          representeLeDiagnosticPourLeClient(
            diagnostic,
            configuration.adaptateurTranscripteurDonnees.transcripteur(),
          ),
        ),
      );
  });

  routes.post("/", (_requete: Request, reponse: Response) => {
    new ServiceDiagnostic(
      configuration.adaptateurReferentiel,
      new EntrepotsMemoire(),
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
