import express, { Request, Response, Router } from "express";
import { ConfigurationServeur } from "../serveur";
import * as crypto from "crypto";
import { representeLeDiagnosticPourLeClient } from "./representateurs/representateurDiagnostic";
import { ServiceDiagnostic } from "../diagnostic/ServiceDiagnostic";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.get("/diagnostic/:id", (_req: Request, res: Response) => {
    const { id } = _req.params;
    new ServiceDiagnostic(configuration.adaptateurDonnees)
      .diagnostic(id as crypto.UUID)
      .then((diagnostic) =>
        res.json(representeLeDiagnosticPourLeClient(diagnostic)),
      );
  });

  return routes;
};

export default routesAPI;
