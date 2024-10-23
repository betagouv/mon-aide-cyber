import { ConfigurationServeur } from '../../serveur';
import { routesAPIDemandesDevenirAidant } from './routeAPIDemandeDevenirAidant';
import { routesAPIDemandeEtreAide } from './routesAPIDemandeEtreAide';
import express, { Router } from 'express';
import { routesAPIDemandeSolliciterAide } from './routesAPIDemandeSolliciterAide';

export const routesAPIDemandes = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/devenir-aidant', routesAPIDemandesDevenirAidant(configuration));
  routes.use('/etre-aide', routesAPIDemandeEtreAide(configuration));
  routes.use('/solliciter-aide', routesAPIDemandeSolliciterAide(configuration));

  return routes;
};
