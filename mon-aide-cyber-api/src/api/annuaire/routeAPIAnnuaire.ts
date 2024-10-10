import express, { Request, response, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import { EntrepotAidant } from '../../authentification/Aidant';

type AnnuaireDTO = { nomPrenom: string };
export type ReponseAPIAnnuaire = AnnuaireDTO[];

class ServiceAnnuaire {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  recherche(): Promise<AnnuaireDTO[]> {
    return this.entrepotAidant.tous().then((aidants) =>
      aidants.map((aidant) => ({
        nomPrenom: aidant.nomPrenom,
      }))
    );
  }
}

export const routesAPIAnnuaire = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots } = configuration;

  routes.get(
    '/',
    async (
      requete: Request,
      reponse: Response<ReponseAPIAnnuaire>,
      suite: NextFunction
    ) => {
      return new ServiceAnnuaire(entrepots.aidants())
        .recherche()
        .then((annuaire) => reponse.status(200).json(annuaire));
    }
  );

  return routes;
};
