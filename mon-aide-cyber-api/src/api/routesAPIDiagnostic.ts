import { ConfigurationServeur } from '../serveur';
import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { SagaAjoutReponse } from '../diagnostic/CapteurSagaAjoutReponse';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Action, TypeActionRestituer } from './representateurs/types';
import { Restitution } from '../restitution/Restitution';
import { RestitutionHTML } from '../adaptateurs/AdaptateurDeRestitutionHTML';

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
        configuration.adaptateurMesures,
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
    '/:id',
    session.verifie('Accès diagnostic'),
    (requete: Request, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(
        configuration.adaptateurReferentiel,
        configuration.adaptateurMesures,
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

      const genereRestitution = (
        restitution: Restitution,
      ): Promise<Buffer | RestitutionHTML> => {
        if (requete.headers.accept === 'application/pdf') {
          return configuration.adaptateursRestitution
            .pdf()
            .genereRestitution(restitution);
        }
        return configuration.adaptateursRestitution
          .html()
          .genereRestitution(restitution);
      };

      const creerReponse = (restitution: Buffer | RestitutionHTML) => {
        if (requete.headers.accept === 'application/pdf') {
          reponse.contentType('application/pdf').send(restitution);
        } else {
          const type = (type: 'pdf' | 'json'): TypeActionRestituer => ({
            [type]: {
              ressource: {
                contentType:
                  type === 'pdf' ? 'application/pdf' : 'application/json',
                methode: 'GET',
                url: `/api/diagnostic/${id}/restitution`,
              },
            },
          });

          const resultat: ReprensentationRestitution = {
            actions: [
              {
                action: 'restituer',
                types: { ...type('pdf'), ...type('json') },
              },
            ],
            ...(restitution as RestitutionHTML),
          };
          reponse.json(resultat);
        }
      };

      configuration.entrepots
        .restitution()
        .lis(id)
        .then((restitution) => genereRestitution(restitution))
        .then((pdf) => creerReponse(pdf))
        .catch((erreur) =>
          suite(ErreurMAC.cree('Demande la restitution', erreur)),
        );
    },
  );

  return routes;
};

export type ReprensentationRestitution = {
  actions: Action[];
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};
