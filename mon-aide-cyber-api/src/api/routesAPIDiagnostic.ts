import { ConfigurationServeur } from "../serveur";
import express, { Request, Response } from "express";
import crypto from "crypto";
import { ServiceDiagnostic } from "../diagnostic/ServiceDiagnostic";
import { representeLeDiagnosticPourLeClient } from "./representateurs/representateurDiagnostic";
import { NextFunction } from "express-serve-static-core";
import bodyParser from "body-parser";

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.post("/", (_requete: Request, reponse: Response) => {
    new ServiceDiagnostic(
      configuration.adaptateurReferentiel,
      configuration.adaptateurTableauDeNotes,
      configuration.entrepots,
    )
      .lance()
      .then((diagnostic) => {
        reponse.status(201);
        reponse.appendHeader(
          "Link",
          `${_requete.originalUrl}/${diagnostic.identifiant}`,
        );
        reponse.send();
      });
  });

  routes.get(
    "/:id",
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeNotes,
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

  routes.patch(
    "/:id",
    bodyParser.json(),
    (requete: Request, reponse, suite) => {
      const { id } = requete.params;
      const corpsReponse = requete.body;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeNotes,
        configuration.entrepots,
      )
        .ajouteLaReponse(id as crypto.UUID, corpsReponse)
        .then(() => {
          reponse.status(204);
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    },
  );

  return routes;
};
