import { ConfigurationServeur } from '../serveur';
import express from 'express';
import { routesAPITableauDeBord } from './espace-aidant/tableau-de-bord/routesAPITableauDeBord';

export const routesAPIEspaceAidant = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.use('/tableau-de-bord', routesAPITableauDeBord(configuration));

  return routes;
};
