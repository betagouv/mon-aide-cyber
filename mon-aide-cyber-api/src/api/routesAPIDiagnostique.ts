import { ConfigurationServeur } from "../serveur";
import express, { Request, Response } from "express";
import { ServiceDiagnostique } from "../diagnostique/ServiceDiagnostique";
import crypto from "crypto";
import { representeLeDiagnostiquePourLeClient } from "./representateurs/representateurDiagnostique";

export const routesAPIDiagnostique = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get("/:id", (requete: Request, reponse: Response) => {
    const { id } = requete.params;
    new ServiceDiagnostique(
      configuration.adaptateurReferentiel,
      configuration.entrepots,
    )
      .diagnostique(id as crypto.UUID)
      .then((diagnostique) =>
        reponse.json(
          representeLeDiagnostiquePourLeClient(
            diagnostique,
            configuration.adaptateurTranscripteurDonnees.transcripteur(),
          ),
        ),
      );
  });

  routes.post("/", (_requete: Request, reponse: Response) => {
    new ServiceDiagnostique(
      configuration.adaptateurReferentiel,
      configuration.entrepots,
    )
      .cree()
      .then((diagnostique) => {
        reponse.status(201);
        reponse.appendHeader(
          "Link",
          `${_requete.originalUrl}/${diagnostique.identifiant}`,
        );
        reponse.send();
      });
  });

  return routes;
};
