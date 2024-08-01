import { routesAPIDiagnostic } from './routesAPIDiagnostic';
import express, { Request, Router } from 'express';
import { ConfigurationServeur } from '../serveur';
import { routesAPIAuthentification } from './routesAPIAuthentification';
import crypto from 'crypto';
import { routesAPIUtilisateur } from './routesAPIUtilisateur';
import { routesAPIEspaceAidant } from './routesAPIEspaceAidant';
import { routesAPIProfil } from './routesAPIProfil';
import { routesAPIAide } from './aide/routesAPIAide';
import { routesAPIDemandesDevenirAidant } from './demandes/routeAPIDemandeDevenirAidant';

export interface RequeteUtilisateur extends Request {
  identifiantUtilisateurCourant?: crypto.UUID;
}

const routesAPIDemandes = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/devenir-aidant', routesAPIDemandesDevenirAidant(configuration));

  return routes;
};

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/diagnostic', routesAPIDiagnostic(configuration));
  routes.use('/token', routesAPIAuthentification(configuration));
  routes.use('/utilisateur', routesAPIUtilisateur(configuration));
  routes.use('/espace-aidant', routesAPIEspaceAidant(configuration));
  routes.use('/profil', routesAPIProfil(configuration));
  routes.use('/aide', routesAPIAide(configuration));
  routes.use('/demandes', routesAPIDemandes(configuration));

  return routes;
};

export default routesAPI;
