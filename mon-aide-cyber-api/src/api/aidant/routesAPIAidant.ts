import { ConfigurationServeur } from '../../serveur';
import express from 'express';
import { routesAPIAidantPreferences } from './routesAPIAidantPreferences';

export const routesAPIAidant = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.use('/preferences', routesAPIAidantPreferences(configuration));

  return routes;
};
