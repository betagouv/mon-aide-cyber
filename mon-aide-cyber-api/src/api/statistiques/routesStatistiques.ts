import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import { ServiceStatistiques } from '../../statistiques/statistiques';

export type ReponseStatistiques = {
  metabase: string;
  nombreAidants: number;
  nombreDiagnostics: number;
  niveauDeSatisfactionDuDiagnostic: string;
};

export const routesStatistiques = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const { adaptateurMetabase: metabase } = configuration;

  routes.get(
    '/',
    async (_requete: Request, reponse: Response<ReponseStatistiques>) => {
      const stats = new ServiceStatistiques(metabase).statistiques();
      return stats.then((statistiques) =>
        reponse.json({
          metabase: statistiques.metabase,
          nombreAidants: statistiques.nombreAidants,
          nombreDiagnostics: statistiques.nombreDiagnostics,
          niveauDeSatisfactionDuDiagnostic:
            statistiques.niveauDeSatisfactionDuDiagnostic.toFixed(1),
        })
      );
    }
  );

  return routes;
};
