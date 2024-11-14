import express, { Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { RequeteUtilisateur } from '../routesAPI';
import { NextFunction } from 'express-serve-static-core';
import crypto from 'crypto';
import { SagaLanceAutoDiagnostic } from '../../auto-diagnostic/CapteurSagaLanceAutoDiagnostic';

export const routesAPIAutoDiagnostic = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { busCommande } = configuration;

  routes.post(
    '/',
    (requete: RequeteUtilisateur, reponse: Response, _suite: NextFunction) => {
      return busCommande
        .publie<
          SagaLanceAutoDiagnostic,
          crypto.UUID
        >({ type: 'SagaLanceAutoDiagnostic' })
        .then((idDiagnostic) =>
          reponse
            .status(201)
            .appendHeader('Link', `${requete.originalUrl}/${idDiagnostic}`)
            .send()
        );
    }
  );

  return routes;
};
