import { routesAPIDiagnostic } from "./routesAPIDiagnostic";
import express, { Router } from "express";
import { ConfigurationServeur } from "../serveur";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use("/diagnostic", routesAPIDiagnostic(configuration));

  return routes;
};

export default routesAPI;
