import express, { Router } from "express";
import { ConfigurationServeur } from "../serveur";
import { routesAPIDiagnostique } from "./routesAPIDiagnostique";
import { routesAPIDiagnostics } from "./routesAPIDiagnostics";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use("/diagnostique", routesAPIDiagnostique(configuration));
  routes.use("/diagnostics", routesAPIDiagnostics(configuration));

  return routes;
};

export default routesAPI;
