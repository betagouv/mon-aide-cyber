import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import {
  CriteresDeRecherche,
  ServiceAnnuaireAidants,
} from '../../annuaire-aidants/ServiceAnnuaireAidants';
import { UUID } from 'crypto';
import { ParsedQs } from 'qs';

type AidantDTO = {
  identifiant: UUID;
  nomPrenom: string;
};

export type ReponseAPIAnnuaireAidants = AidantDTO[];

export const routesAPIAnnuaireAidants = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { entrepots } = configuration;

  routes.get(
    '/',
    async (
      requete: Request,
      reponse: Response<ReponseAPIAnnuaireAidants>,
      _suite: NextFunction
    ) => {
      const estCriteresDeRecherche = (
        criteresDeRecherche: CriteresDeRecherche | ParsedQs
      ): criteresDeRecherche is CriteresDeRecherche => {
        return criteresDeRecherche && !!criteresDeRecherche.territoires;
      };
      const criteresDeRecherche = estCriteresDeRecherche(requete.query)
        ? requete.query
        : undefined;
      return new ServiceAnnuaireAidants(entrepots.annuaireAidants())
        .recherche(criteresDeRecherche)
        .then((annuaire) =>
          reponse.status(200).json(
            annuaire.map((a) => ({
              identifiant: a.identifiant,
              nomPrenom: a.nomPrenom,
            }))
          )
        );
    }
  );

  return routes;
};
