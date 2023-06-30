import express, { Request, Response, Router } from "express";
import { ServiceDiagnostique } from "../diagnostique/serviceDiagnostique";
import { ConfigurationServeur } from "../serveur";
import * as crypto from "crypto";
import { representeLeDiagnostiquePourLeClient } from "./representateurs/representateurDiagnostique";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.get("/diagnostiques/:id", (_req: Request, res: Response) => {
    const { id } = _req.params;
    new ServiceDiagnostique(configuration.adaptateurDonnees)
      .diagnostique(id as crypto.UUID)
      .then((diagnostique) =>
        res.json(representeLeDiagnostiquePourLeClient(diagnostique)),
      );
  });

  return routes;
};

export default routesAPI;
