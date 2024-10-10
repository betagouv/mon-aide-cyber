import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import { Aidant } from '../../annuaire-aidants/annuaireAidants';
import { ServiceAnnuaireAidants } from '../../annuaire-aidants/ServiceAnnuaireAidants';

export type ReponseAPIAnnuaireAidants = Aidant[];

export const routesAPIAnnuaireAidants = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { entrepots } = configuration;

  routes.get(
    '/',
    async (
      _requete: Request,
      reponse: Response<ReponseAPIAnnuaireAidants>,
      _suite: NextFunction
    ) => {
      return new ServiceAnnuaireAidants(entrepots.aidants())
        .recherche()
        .then((annuaire) => reponse.status(200).json(annuaire));
    }
  );

  return routes;
};
