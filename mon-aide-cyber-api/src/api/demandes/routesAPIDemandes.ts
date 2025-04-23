import { ConfigurationServeur } from '../../serveur';
import { routesAPIDemandesDevenirAidant } from './routeAPIDemandeDevenirAidant';
import { routesAPIDemandeEtreAide } from './routesAPIDemandeEtreAide';
import express, { Request, Response, Router } from 'express';

export const routesAPIDemandes = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/devenir-aidant', routesAPIDemandesDevenirAidant(configuration));
  routes.use('/etre-aide', routesAPIDemandeEtreAide(configuration));
  routes.post(
    '/dummy-etre-aide',
    express.json(),
    async (requete: Request, reponse: Response) => {
      reponse
        .status(201)
        .json({ reponse: `Email reçu : ${requete.body.email}` });
    }
  );

  return routes;
};
