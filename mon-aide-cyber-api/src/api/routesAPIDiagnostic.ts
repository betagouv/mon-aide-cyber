import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { SagaAjoutReponse } from '../diagnostic/CapteurSagaAjoutReponse';
import { ErreurMAC } from '../domaine/erreurMAC';

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { adaptateurDeVerificationDeSession: session, busCommande } =
    configuration;

  routes.post(
    '/',
    session.verifie('Lance le diagnostic'),
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
    session.verifie('Demande la restitution'),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      configuration.entrepots
        .restitution()
        .lis(id)
        .then((restitution) =>
          configuration.adaptateursRestitution
            .pdf()
            .genereRestitution(restitution),
        )
        .then((pdf) => reponse.contentType('application/pdf').send(pdf))
        .catch((erreur) =>
          suite(ErreurMAC.cree('Demande la restitution', erreur)),
        );
    },
  );

  routes.get(
    '/:id',
    session.verifie('Accès diagnostic'),
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
    session.verifie('Ajout réponse au diagnostic'),
    bodyParser.json(),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      const corpsReponse = requete.body;
      const commande: SagaAjoutReponse = {
        type: 'SagaAjoutReponse',
        idDiagnostic: id,
        ...corpsReponse,
      };
      busCommande
        .publie(commande)
        .then(() => {
          reponse.status(204);
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    },
  );

  routes.get(
    '/:id/restitution',
    session.verifie('Demande la restitution'),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      configuration.entrepots
        .restitution()
        .lis(id)
        .then((restitution) =>
          configuration.adaptateursRestitution
            .html()
            .genereRestitution(restitution),
        )
        .then((restitution) => reponse.json(restitution))
        .catch((erreur) =>
          suite(ErreurMAC.cree('Demande la restitution', erreur)),
        );
    },
  );

  return routes;
};
