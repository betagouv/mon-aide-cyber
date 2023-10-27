import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  routes.post(
    '/',
    (_requete: Request, reponse: Response, suite: NextFunction) => {
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeRecommandations,
        configuration.entrepots,
        configuration.busEvenement,
      )
        .lance()
        .then((diagnostic) => {
          reponse.status(201);
          reponse.appendHeader(
            'Link',
            `${_requete.originalUrl}/${diagnostic.identifiant}`,
          );
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    },
  );

  routes.get(
    '/:id/termine',
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      const serviceDiagnostic = new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeRecommandations,
        configuration.entrepots,
        configuration.busEvenement,
      );
      serviceDiagnostic
        .termine(id as crypto.UUID)
        .then(() => serviceDiagnostic.diagnostic(id as crypto.UUID))
        .then((diagnostic) =>
          configuration.adaptateurPDF.genereRecommandations(diagnostic),
        )
        .then((pdf) => reponse.contentType('application/pdf').send(pdf))
        .catch((erreur) => suite(erreur));
    },
  );

  routes.get(
    '/:id',
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeRecommandations,
        configuration.entrepots,
      )
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json(
            representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur(),
            ),
          ),
        )
        .catch((erreur) => suite(erreur));
    },
  );

  routes.patch(
    '/:id',
    bodyParser.json(),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      const corpsReponse = requete.body;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurTableauDeRecommandations,
        configuration.entrepots,
        configuration.busEvenement,
      )
        .ajouteLaReponse(id as crypto.UUID, corpsReponse)
        .then(() => {
          reponse.status(204);
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    },
  );

  return routes;
};
