import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response } from 'express';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { adaptateurAssociations } from '../../adaptateurs/adaptateurAssociations';
import path from 'node:path';
import { ReponseHATEOASEnErreur } from '../hateoas/hateoas';

export type Association = {
  nom: string;
  siteUrl: string;
};

export class ErreurLectureReferentielAssociations extends Error {
  constructor(erreur: Error) {
    super(erreur.message);
  }
}

export const routesAssociations = (__configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.get(
    '/',
    async (
      __requete: Request,
      reponse: Response<Association[] | ReponseHATEOASEnErreur>,
      suite: NextFunction
    ) => {
      try {
        const donnees = adaptateurAssociations.referentiel(
          path.join(__dirname, 'referentiel.yaml')
        );
        return reponse.status(200).json(donnees);
      } catch (erreur: unknown | Error) {
        return suite(
          ErreurMAC.cree(
            'Accède au référentiel associatif',
            new ErreurLectureReferentielAssociations(erreur as Error)
          )
        );
      }
    }
  );

  return routes;
};
