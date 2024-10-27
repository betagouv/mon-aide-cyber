import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import crypto, { UUID } from 'crypto';
import { ServiceDiagnostic } from '../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from './representateurs/representateurDiagnostic';
import { NextFunction } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import {
  CorpsReponse,
  SagaAjoutReponse,
} from '../diagnostic/CapteurSagaAjoutReponse';
import { ErreurMAC } from '../domaine/erreurMAC';
import { Restitution } from '../restitution/Restitution';
import { RequeteUtilisateur } from './routesAPI';
import { CommandeLanceDiagnostic } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { Diagnostic } from '../diagnostic/Diagnostic';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from './hateoas/hateoas';
import { RepresentationDiagnostic } from './representateurs/types';
import { RestitutionHTML } from '../infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';
import {
  DefinitionAidantInitieDiagnostic,
  definitionAidantInitieDiagnostic,
} from '../diagnostic/tuples';

export type ReponseDiagnostic = ReponseHATEOAS & RepresentationDiagnostic;

export const routesAPIDiagnostic = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    adaptateurDeVerificationDeRelations: relations,
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
            `${requete.originalUrl}/${diagnostic.identifiant}`
          );
          reponse.send();
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.get(
    '/:id',
    session.verifie('Accès diagnostic'),
    cgu.verifie(),
    relations.verifie<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic.definition
    ),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;
      new ServiceDiagnostic(configuration.entrepots)
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            ...constructeurActionsHATEOAS()
              .accesDiagnostic(diagnostic.identifiant)
              .construis(),
          })
        )
        .catch((erreur) => suite(erreur));
    }
  );

  routes.patch(
    '/:id',
    session.verifie('Ajout réponse au diagnostic'),
    cgu.verifie(),
    relations.verifie<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic.definition
    ),
    bodyParser.json(),
    (
      requete: RequeteUtilisateur<CorpsReponse, { id: UUID }>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const { id } = requete.params;
      const corpsReponse = requete.body;
      const commande: SagaAjoutReponse = {
        type: 'SagaAjoutReponse',
        idDiagnostic: id,
        ...corpsReponse,
      };
      busCommande
        .publie<SagaAjoutReponse, Diagnostic>(commande)
        .then((diagnostic) => {
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            ...constructeurActionsHATEOAS()
              .ajoutReponseAuDiagnostic(diagnostic.identifiant)
              .construis(),
          });
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.get(
    '/:id/restitution',
    session.verifie('Demande la restitution'),
    cgu.verifie(),
    relations.verifie<DefinitionAidantInitieDiagnostic>(
      definitionAidantInitieDiagnostic.definition
    ),
    (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      const { id } = requete.params;

      const genereRestitution = (
        restitution: Restitution
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
            .demandeLaRestitution(id)
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
          suite(ErreurMAC.cree('Demande la restitution', erreur))
        );
    }
  );

  return routes;
};

export type ReprensentationRestitution = ReponseHATEOAS & {
  autresMesures: string;
  contactsEtLiensUtiles: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
  ressources: string;
};
