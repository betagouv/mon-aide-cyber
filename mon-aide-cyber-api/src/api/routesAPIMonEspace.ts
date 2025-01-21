import { ConfigurationServeur } from '../serveur';
import express from 'express';
import { routesAPITableauDeBord } from './tableau-de-bord/routesAPITableauDeBord';

export const routesAPIMonEspace = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.use('/tableau-de-bord', routesAPITableauDeBord(configuration));

  return routes;
};
