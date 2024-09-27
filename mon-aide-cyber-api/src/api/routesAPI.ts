import { routesAPIDiagnostic } from './routesAPIDiagnostic';
import express, { Request, Router } from 'express';
import { ConfigurationServeur } from '../serveur';
import { routesAPIAuthentification } from './routesAPIAuthentification';
import crypto from 'crypto';
import { routesAPIUtilisateur } from './routesAPIUtilisateur';
import { routesAPIEspaceAidant } from './routesAPIEspaceAidant';
import { routesAPIProfil } from './routesAPIProfil';
import { routesAPIDemandes } from './demandes/routesAPIDemandes';
import { routeAPIContexte } from './routeAPIContexte';
import { routesAPIAidant } from './aidant/routesAPIAidant';
import * as core from 'express-serve-static-core';

export interface RequeteUtilisateur<
  CORPS = void,
  PARAMS extends core.ParamsDictionary = core.ParamsDictionary,
> extends Request {
  identifiantUtilisateurCourant?: crypto.UUID;
  body: CORPS;
  params: PARAMS;
}

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/contexte', routeAPIContexte(configuration));
  routes.use('/diagnostic', routesAPIDiagnostic(configuration));
  routes.use('/token', routesAPIAuthentification(configuration));
  routes.use('/utilisateur', routesAPIUtilisateur(configuration));
  routes.use('/aidant', routesAPIAidant(configuration));
  routes.use('/espace-aidant', routesAPIEspaceAidant(configuration));
  routes.use('/profil', routesAPIProfil(configuration));
  routes.use('/demandes', routesAPIDemandes(configuration));

  return routes;
};

export default routesAPI;
