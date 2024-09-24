import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import { ConfigurationServeur } from '../serveur';

export type InformationsContexte = {
  contexte: string;
};

export const routeAPIContexte = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const { recuperateurDeCookies } = configuration;

  const estInformationContexte = (
    informationsContexte: InformationsContexte | ParsedQs
  ): informationsContexte is InformationsContexte =>
    !!informationsContexte && !!informationsContexte.contexte;

  routes.get('/', (requete: Request, reponse: Response) => {
    if (recuperateurDeCookies(requete, reponse)) {
      return reponse.json(
        constructeurActionsHATEOAS().afficherTableauDeBord().construis()
      );
    }
    if (estInformationContexte(requete.query)) {
      return reponse.json(
        constructeurActionsHATEOAS().pour(requete.query).construis()
      );
    }
    return reponse.json(
      constructeurActionsHATEOAS().actionsPubliques().construis()
    );
  });

  return routes;
};
