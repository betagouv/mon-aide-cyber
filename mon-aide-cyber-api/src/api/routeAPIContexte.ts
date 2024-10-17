import express, { Request, Response } from 'express';
import { ParsedQs } from 'qs';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import { ConfigurationServeur } from '../serveur';
import { jwtPayload } from '../adaptateurs/fabriqueDeCookies';

export type InformationsContexte = {
  contexte: string;
};

export const routeAPIContexte = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const { recuperateurDeCookies, entrepots, gestionnaireDeJeton } =
    configuration;

  const estInformationContexte = (
    informationsContexte: InformationsContexte | ParsedQs
  ): informationsContexte is InformationsContexte =>
    !!informationsContexte && !!informationsContexte.contexte;

  routes.get('/', (requete: Request, reponse: Response) => {
    const actionsAidantConnecte = (cookies: string) => {
      const jwt = jwtPayload({ session: cookies }, gestionnaireDeJeton);
      const actionsHATEOAS = constructeurActionsHATEOAS();
      if (jwt.identifiant) {
        return entrepots
          .aidants()
          .lis(jwt.identifiant)
          .then((aidant) =>
            reponse.json({
              ...(aidant.dateSignatureCGU
                ? {
                    ...actionsHATEOAS.afficherTableauDeBord().construis(),
                  }
                : { ...actionsHATEOAS.creerEspaceAidant().construis() }),
            })
          );
      }
      return reponse.json(
        constructeurActionsHATEOAS().afficherTableauDeBord().construis()
      );
    };

    const cookies = recuperateurDeCookies(requete, reponse);
    if (cookies) {
      try {
        return actionsAidantConnecte(cookies);
      } catch (erreur: unknown | Error) {
        console.log(
          'Une erreur a eu lieu lors de la vérification de la session sur la route /api/contexte. Nous n’en tenons pas compte, on renvoie les liens publics',
          (erreur as Error).message
        );
      }
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
