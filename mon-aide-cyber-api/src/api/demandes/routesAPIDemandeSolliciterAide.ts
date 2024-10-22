import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response, Router } from 'express';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

type CorpsRequeteDemandeSolliciterAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale: string;
  aidantSollicite: crypto.UUID;
};

export const routesAPIDemandeSolliciterAide = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();
  const { entrepots } = configuration;

  routes.post(
    '/',
    express.json(),
    async (
      requete: Request<CorpsRequeteDemandeSolliciterAide>,
      reponse: Response,
      _suite: NextFunction
    ) => {
      const corps = requete.body;
      entrepots.aides().persiste({
        identifiant: crypto.randomUUID(),
        dateSignatureCGU: FournisseurHorloge.maintenant(),
        email: corps.email,
        departement: corps.departement,
      });
      return reponse.status(202).send();
    }
  );

  return routes;
};
