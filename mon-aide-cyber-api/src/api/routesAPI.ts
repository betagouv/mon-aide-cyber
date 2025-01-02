import { routesAPIDiagnostic } from './routesAPIDiagnostic';
import express, { Request, Router } from 'express';
import { ConfigurationServeur } from '../serveur';
import { routesAPIAuthentification } from './routesAPIAuthentification';
import crypto from 'crypto';
import { routesAPIUtilisateur } from './routesAPIUtilisateur';
import { routesAPIEspaceAidant } from './routesAPIEspaceAidant';
import { routesAPIDemandes } from './demandes/routesAPIDemandes';
import { routeAPIContexte } from './routeAPIContexte';
import { routesAPIAidant } from './aidant/routesAPIAidant';
import * as core from 'express-serve-static-core';
import { routesAPIProfil } from './aidant/routesAPIProfil';
import { routesAPIAnnuaireAidants } from './annuaire-aidants/routeAPIAnnuaireAidants';
import { routesAPIDiagnosticLibreAcces } from './diagnostic-libre-acces/routesAPIDiagnosticLibreAcces';
import { routesAPIRechercheEntreprise } from './recherche-entreprise/routesAPIRechercheEntreprise';

export interface RequeteUtilisateur<
  CORPS = void,
  PARAMS extends core.ParamsDictionary = core.ParamsDictionary,
> extends Request {
  identifiantUtilisateurCourant?: crypto.UUID;
  estProConnect?: boolean;
  body: CORPS;
  params: PARAMS;
}

const routesAPI = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/contexte', routeAPIContexte(configuration));
  routes.use(
    '/diagnostic-libre-acces',
    routesAPIDiagnosticLibreAcces(configuration)
  );
  routes.use('/diagnostic', routesAPIDiagnostic(configuration));
  routes.use('/token', routesAPIAuthentification(configuration));
  routes.use('/utilisateur', routesAPIUtilisateur(configuration));
  routes.use('/aidant', routesAPIAidant(configuration));
  routes.use('/espace-aidant', routesAPIEspaceAidant(configuration));
  routes.use('/profil', routesAPIProfil(configuration));
  routes.use('/demandes', routesAPIDemandes(configuration));
  routes.use('/annuaire-aidants', routesAPIAnnuaireAidants(configuration));
  routes.use(
    '/recherche-entreprise',
    routesAPIRechercheEntreprise(configuration)
  );

  return routes;
};

export default routesAPI;
