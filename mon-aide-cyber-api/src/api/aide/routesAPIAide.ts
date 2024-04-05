import { ConfigurationServeur } from '../../serveur';
import express, { Router } from 'express';
import { routesAPIAideCGU } from './routesAPIAideCGU';
import { routesAPIAideDemande } from './routesAPIAideDemande';

export const routesAPIAide = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/cgu', routesAPIAideCGU(configuration));
  routes.use('/demande', routesAPIAideDemande(configuration));

  return routes;
};
