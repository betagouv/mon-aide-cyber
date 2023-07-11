import { routesAPIDiagnostic } from "./routesAPIDiagnostic";
import express, { Router } from "express";
import { ConfigurationServeur } from "../serveur";
import { routesAPIDiagnostics } from "./routesAPIDiagnostics";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use("/diagnostic", routesAPIDiagnostic(configuration));
  routes.use("/diagnostics", routesAPIDiagnostics(configuration));

  return routes;
};

export default routesAPI;
