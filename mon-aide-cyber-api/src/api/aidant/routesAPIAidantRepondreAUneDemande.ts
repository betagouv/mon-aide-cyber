import { ConfigurationServeur } from '../../serveur';
import express from 'express';

export const routesAPIAidantRepondreAUneDemande = (
  _configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  routes.post('/', async (_requete, reponse, _suite) =>
    reponse.status(202).send()
  );

  return routes;
};
