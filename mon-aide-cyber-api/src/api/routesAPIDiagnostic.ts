import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import crypto from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { SagaAjoutReponse } from '../diagnostic/CapteurSagaAjoutReponse';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Restitution } from '../restitution/Restitution';
import { RestitutionHTML } from '../adaptateurs/AdaptateurDeRestitutionHTML';
import { RequeteUtilisateur } from './routesAPI';
import { CommandeLanceDiagnostic } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { Diagnostic } from '../diagnostic/Diagnostic';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { RepresentationDiagnostic } from './representateurs/types';

export type ReponseDiagnostic = ReponseHATEOAS & RepresentationDiagnostic;

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    busCommande,
  } = configuration;

  routes.post(
    '/',
    session.verifie('Lance le diagnostic'),
    cgu.verifie(),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const commande: CommandeLanceDiagnostic = {
        type: 'CommandeLanceDiagnostic',
        adaptateurReferentiel: configuration.adaptateurReferentiel,
        adaptateurReferentielDeMesures: configuration.adaptateurMesures,
        identifiantAidant: requete.identifiantUtilisateurCourant!,
      };
      busCommande
        .publie<CommandeLanceDiagnostic, Diagnostic>(commande)
        .then((diagnostic) => {
          reponse.status(201);
          reponse.appendHeader(
            'Link',
            `${requete.originalUrl}/${diagnostic.identifiant}`,
          );
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    },
  );

  routes.get(
    '/:id',
    session.verifie('Accès diagnostic'),
    cgu.verifie(),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(configuration.entrepots)
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur(),
            ),
            ...constructeurActionsHATEOAS()
              .actionsDiagnosticLance(diagnostic.identifiant)
              .construis(),
          }),
        )
        .catch((erreur) => suite(erreur));
    },
  );

  routes.patch(
    '/:id',
    session.verifie('Ajout réponse au diagnostic'),
    cgu.verifie(),
    bodyParser.json(),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
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
    cgu.verifie(),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
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
          const reponseHATEOAS = constructeurActionsHATEOAS()
            .lancerDiagnostic()
            .restituerDiagnostic(id)
            .modifierDiagnostic(id)
            .afficherProfil()
            .construis();
          const resultat: ReprensentationRestitution = {
            ...reponseHATEOAS,
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

export type ReprensentationRestitution = ReponseHATEOAS & {
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};
