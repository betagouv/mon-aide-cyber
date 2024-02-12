import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { ServiceFinalisationCreationCompte } from '../compte/ServiceFinalisationCompte';

export const routesAPIUtilisateur = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots, adaptateurDeVerificationDeSession: session } =
    configuration;

  routes.post(
    '/finalise',
    express.json(),
    session.verifie('Finalise la création du compte'),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      try {
        const finalisationCompte: {
          cguSignees: boolean;
          charteSignee: boolean;
        } = requete.body;
        await new ServiceFinalisationCreationCompte(entrepots).finalise({
          ...finalisationCompte,
          identifiant: requete.identifiantUtilisateurCourant!,
        });
        reponse.status(204);
        reponse.send();
      } catch (erreur) {
        suite(erreur);
      }
    },
  );

  return routes;
};
