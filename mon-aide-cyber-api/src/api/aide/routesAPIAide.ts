import { ConfigurationServeur } from '../../serveur';
import express, { Router } from 'express';
import { routesAPIAideCGU } from './routesAPIAideCGU';

export const routesAPIAide = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/cgu', routesAPIAideCGU(configuration));

  return routes;
};
