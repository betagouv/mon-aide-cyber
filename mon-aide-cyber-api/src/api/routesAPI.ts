import express, { Router } from "express";
import { ConfigurationServeur } from "../serveur";
import { routesAPIDiagnostique } from "./routesAPIDiagnostique";

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use("/diagnostique", routesAPIDiagnostique(configuration));

  return routes;
};

export default routesAPI;
