import express, { Request, Response, Router } from "express";
import { ServiceDiagnostique } from "../diagnostique/ServiceDiagnostique";
import { ConfigurationServeur } from "../serveur";
import * as crypto from "crypto";
import { representeLeDiagnostiquePourLeClient } from "./representateurs/representateurDiagnostique";
import { EntrepotsMemoire } from "../infrastructure/entrepots/memoire/Entrepots";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.get("/diagnostiques/:id", (_req: Request, res: Response) => {
    const { id } = _req.params;
    new ServiceDiagnostique(
      configuration.adaptateurReferentiel,
      new EntrepotsMemoire(),
    )
      .diagnostique(id as crypto.UUID)
      .then((diagnostique) =>
        res.json(
          representeLeDiagnostiquePourLeClient(
            diagnostique,
            configuration.adaptateurTranscripteurDonnees.transcripteur(),
          ),
        ),
      );
  });

  return routes;
};

export default routesAPI;
