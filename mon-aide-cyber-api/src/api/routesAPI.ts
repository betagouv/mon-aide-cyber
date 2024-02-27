import { routesAPIDiagnostic } from './routesAPIDiagnostic';
import express, { Request, Router } from 'express';
import { ConfigurationServeur } from '../serveur';
import { routesAPIDiagnostics } from './routesAPIDiagnostics';
import { routesAPIAuthentification } from './routesAPIAuthentification';
import crypto from 'crypto';
import { routesAPIUtilisateur } from './routesAPIUtilisateur';
import { routesAPIEspaceAidant } from './routesAPIEspaceAidant';

export interface RequeteUtilisateur extends Request {
  identifiantUtilisateurCourant?: crypto.UUID;
}

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/diagnostic', routesAPIDiagnostic(configuration));
  routes.use('/diagnostics', routesAPIDiagnostics(configuration));
  routes.use('/token', routesAPIAuthentification(configuration));
  routes.use('/utilisateur', routesAPIUtilisateur(configuration));
  routes.use('/espace-aidant', routesAPIEspaceAidant(configuration));

  return routes;
};

export default routesAPI;
