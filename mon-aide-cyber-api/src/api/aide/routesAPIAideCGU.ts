import { ConfigurationServeur } from '../../serveur';
import express, { Request, Router, Response } from 'express';
import { SagaDemandeValidationCGUAide } from '../../parcours-cgu-aide/CapteurSagaDemandeValidationCGUAide';
import { NextFunction } from 'express-serve-static-core';

type CorpsRequeteValidationCGUAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale: string;
};
export const routesAPIAideCGU = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.post(
    '/',
    express.json(),
    async (requete: Request, reponse: Response, _suite: NextFunction) => {
      const corpsRequete: CorpsRequeteValidationCGUAide = requete.body;
      const saga: SagaDemandeValidationCGUAide = {
        type: 'SagaDemandeValidationCGUAide',
        cguValidees: corpsRequete.cguValidees,
        email: corpsRequete.email,
        departement: corpsRequete.departement,
        raisonSociale: corpsRequete.raisonSociale,
      };
      return configuration.busCommande.publie(saga).then(() => {
        reponse.status(202);
        return reponse.send();
      });
    },
  );

  return routes;
};
