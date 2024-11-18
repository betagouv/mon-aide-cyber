import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import crypto from 'crypto';
import { SagaLanceAutoDiagnostic } from '../../auto-diagnostic/CapteurSagaLanceAutoDiagnostic';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from '../representateurs/representateurDiagnostic';
import { ReponseHATEOAS } from '../hateoas/hateoas';
import { RepresentationDiagnostic } from '../representateurs/types';

type CorpsReponseAutoDiagnostic = ReponseHATEOAS & RepresentationDiagnostic;

export const routesAPIAutoDiagnostic = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { busCommande } = configuration;

  routes.post(
    '/',
    (requete: Request, reponse: Response, _suite: NextFunction) => {
      return busCommande
        .publie<
          SagaLanceAutoDiagnostic,
          crypto.UUID
        >({ type: 'SagaLanceAutoDiagnostic', email: '', dateSignatureCGU: FournisseurHorloge.maintenant() })
        .then((idDiagnostic) =>
          reponse
            .status(201)
            .appendHeader('Link', `${requete.originalUrl}/${idDiagnostic}`)
            .send()
        );
    }
  );

  routes.get(
    '/:id',
    (
      requete: Request,
      reponse: Response<CorpsReponseAutoDiagnostic>,
      suite: NextFunction
    ) => {
      const { id } = requete.params;
      new ServiceDiagnostic(configuration.entrepots)
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            liens: {
              'repondre-diagnostic': {
                url: `/api/auto-diagnostic/${diagnostic.identifiant}`,
                methode: 'PATCH',
              },
            },
          })
        )
        .catch((erreur) => suite(erreur));
    }
  );

  return routes;
};
