import { ConfigurationServeur } from '../../serveur';
import express from 'express';
import { routesAPIAidantPreferences } from './routesAPIAidantPreferences';
import { routesAPIAidantRepondreAUneDemande } from './routesAPIAidantRepondreAUneDemande';

export const routesAPIAidant = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.use('/preferences', routesAPIAidantPreferences(configuration));
  routes.use(
    '/repondre-a-une-demande',
    routesAPIAidantRepondreAUneDemande(configuration)
  );

  return routes;
};
