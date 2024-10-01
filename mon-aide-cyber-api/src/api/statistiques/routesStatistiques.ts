import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';

export type ReponseStatistiques = {
  nombreDiagnostics: number;
  nombreAidantsFormes: number;
  nombreSessionFamiliarisation: number;
};
export const routesStatistiques = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const { entrepots } = configuration;

  routes.get(
    '/',
    (_requete: Request, reponse: Response<ReponseStatistiques>) => {
      return entrepots
        .statistiques()
        .lis()
        .then((statistiques) =>
          reponse.json({
            nombreDiagnostics: statistiques.nombreDiagnostics,
            nombreAidantsFormes: statistiques.nombreAidants,
            nombreSessionFamiliarisation: 45,
          })
        );
    }
  );

  return routes;
};
