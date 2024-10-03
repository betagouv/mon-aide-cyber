import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import { ServiceStatistiques } from '../../statistiques/statistiques';

export type ReponseStatistiques = {
  metabase: string;
  nombreDiagnostics: number;
  nombreAidantsFormes: number;
  nombreSessionFamiliarisation: number;
};

export const routesStatistiques = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const { entrepots, adaptateurMetabase: metabase } = configuration;

  routes.get(
    '/',
    (_requete: Request, reponse: Response<ReponseStatistiques>) => {
      const stats = new ServiceStatistiques(
        entrepots.statistiques(),
        metabase
      ).statistiques();
      return stats.then((statistiques) =>
        reponse.json({
          nombreDiagnostics: statistiques.nombreDiagnostics,
          nombreAidantsFormes: statistiques.nombreAidants,
          nombreSessionFamiliarisation: 45,
          metabase: statistiques.metabase,
        })
      );
    }
  );

  return routes;
};
