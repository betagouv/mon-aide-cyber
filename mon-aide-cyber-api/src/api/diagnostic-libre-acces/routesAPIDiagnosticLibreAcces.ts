import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import crypto, { UUID } from 'crypto';
import { SagaLanceDiagnosticLibreAcces } from '../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from '../representateurs/representateurDiagnostic';
import {
  constructeurActionsHATEOAS,
  ReponseHATEOAS,
  ReponseHATEOASEnErreur,
} from '../hateoas/hateoas';
import { RepresentationDiagnostic } from '../representateurs/types';
import {
  ExpressValidator,
  FieldValidationError,
  Result,
  body,
  validationResult,
} from 'express-validator';
import {
  definitionEntiteInitieDiagnosticLibreAcces,
  DefinitionEntiteInitieDiagnosticLibreAcces,
} from '../../diagnostic-libre-acces/consommateursEvenements';
import {
  CorpsReponse,
  SagaAjoutReponse,
} from '../../diagnostic/CapteurSagaAjoutReponse';
import { Diagnostic, EntrepotDiagnostic } from '../../diagnostic/Diagnostic';
import * as core from 'express-serve-static-core';
import { Restitution } from '../../restitution/Restitution';
import { RestitutionHTML } from '../../infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';
import { RepresentationRestitution } from '../routesAPIDiagnostic';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { differenceInDays } from 'date-fns';
import { adaptateurConfigurationLimiteurTraffic } from '../adaptateurLimiteurTraffic';

type CorpsReponseDiagnosticLibreAcces = ReponseHATEOAS &
  RepresentationDiagnostic;

export type CorpsReponseCreerDiagnosticLibreAccesEnErreur =
  ReponseHATEOASEnErreur;

type CorpsRestitution = RepresentationRestitution | Buffer;

const validateurDiagnosticLibreAcces = (
  entrepotDiagnostic: EntrepotDiagnostic
) => {
  const { param } = new ExpressValidator({
    diagnosticMoinsDe7Jours: async (identifiant: string) => {
      return entrepotDiagnostic.lis(identifiant).then((diagnostic) => {
        if (
          differenceInDays(
            FournisseurHorloge.maintenant(),
            diagnostic.dateCreation
          ) >= 7
        ) {
          throw new Error(
            'Le diagnostic en libre accès a été initié il y a 7 jours ou plus.'
          );
        }
        return true;
      });
    },
  });
  return param('id')
    .diagnosticMoinsDe7Jours()
    .withMessage("Le diagnostic demandé n'a pas été trouvé.");
};
export const routesAPIDiagnosticLibreAcces = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const {
    busCommande,
    adaptateurDeVerificationDeRelations: relations,
    entrepots,
  } = configuration;

  const envoieReponseDiagnosticNonTrouve = (
    reponse: Response,
    message = "Le diagnostic demandé n'existe pas."
  ) =>
    reponse.status(404).json({
      liens: {
        'creer-diagnostic': {
          url: '/api/diagnostic-libre-acces',
          methode: 'POST',
        },
      },
      message: message,
    });

  routes.post(
    '/',
    adaptateurConfigurationLimiteurTraffic('TRES-LIMITE'),
    express.json(),
    body('cguSignees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez signer les CGU.'),
    (
      requete: Request,
      reponse: Response<CorpsReponseCreerDiagnosticLibreAccesEnErreur>
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
          ...constructeurActionsHATEOAS()
            .pour({ contexte: 'utiliser-outil-diagnostic:creer' })
            .construis(),
        });
      }
      return busCommande
        .publie<
          SagaLanceDiagnosticLibreAcces,
          crypto.UUID
        >({ type: 'SagaLanceDiagnosticLibreAcces', dateSignatureCGU: FournisseurHorloge.maintenant() })
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
    adaptateurConfigurationLimiteurTraffic('LIMITE'),
    relations.verifie<DefinitionEntiteInitieDiagnosticLibreAcces>(
      definitionEntiteInitieDiagnosticLibreAcces.definition
    ),
    validateurDiagnosticLibreAcces(entrepots.diagnostic()),
    (
      requete: Request,
      reponse: Response<
        CorpsReponseDiagnosticLibreAcces | ReponseHATEOASEnErreur
      >,
      suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return envoieReponseDiagnosticNonTrouve(reponse);
      }
      const { id } = requete.params;
      return new ServiceDiagnostic(configuration.entrepots)
        .diagnostic(id as crypto.UUID)
        .then((diagnostic) =>
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            liens: {
              'repondre-diagnostic': {
                url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}`,
                methode: 'PATCH',
              },
              [`afficher-diagnostic-${diagnostic.identifiant}`]: {
                url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`,
                methode: 'GET',
              },
            },
          })
        )
        .catch((erreur) => suite(erreur));
    }
  );

  routes.patch(
    '/:id',
    adaptateurConfigurationLimiteurTraffic('STANDARD'),
    relations.verifie<DefinitionEntiteInitieDiagnosticLibreAcces>(
      definitionEntiteInitieDiagnosticLibreAcces.definition
    ),
    validateurDiagnosticLibreAcces(entrepots.diagnostic()),
    express.json(),
    (
      requete: Request<core.ParamsDictionary & CorpsReponse & { id: UUID }>,
      reponse: Response,
      suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return envoieReponseDiagnosticNonTrouve(reponse);
      }
      const { id } = requete.params;
      const corpsReponse = requete.body;
      const commande: SagaAjoutReponse = {
        type: 'SagaAjoutReponse',
        idDiagnostic: id,
        ...corpsReponse,
      };
      return busCommande
        .publie<SagaAjoutReponse, Diagnostic>(commande)
        .then((diagnostic) => {
          reponse.json({
            ...representeLeDiagnosticPourLeClient(
              diagnostic,
              configuration.adaptateurTranscripteurDonnees.transcripteur()
            ),
            liens: {
              'repondre-diagnostic': {
                url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}`,
                methode: 'PATCH',
              },
              [`afficher-diagnostic-${diagnostic.identifiant}`]: {
                url: `/api/diagnostic-libre-acces/${diagnostic.identifiant}/restitution`,
                methode: 'GET',
              },
            },
          });
        })
        .catch((erreur) => suite(erreur));
    }
  );

  routes.get(
    '/:id/restitution',
    adaptateurConfigurationLimiteurTraffic('LIMITE'),
    relations.verifie<DefinitionEntiteInitieDiagnosticLibreAcces>(
      definitionEntiteInitieDiagnosticLibreAcces.definition
    ),
    validateurDiagnosticLibreAcces(entrepots.diagnostic()),
    (
      requete: Request,
      reponse: Response<CorpsRestitution | ReponseHATEOASEnErreur>,
      suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return envoieReponseDiagnosticNonTrouve(
          reponse,
          "La restitution demandée n'existe pas."
        );
      }
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
          return reponse
            .contentType('application/pdf')
            .send(restitution as Buffer);
        } else {
          const reponseHATEOAS: ReponseHATEOAS = {
            liens: {
              'modifier-diagnostic': {
                url: `/api/diagnostic-libre-acces/${id}`,
                methode: 'GET',
              },
              'restitution-json': {
                contentType: 'application/json',
                methode: 'GET',
                url: `/api/diagnostic-libre-acces/${id}/restitution`,
              },
              'restitution-pdf': {
                contentType: 'application/pdf',
                methode: 'GET',
                url: `/api/diagnostic-libre-acces/${id}/restitution`,
              },
            },
          };
          const resultat: RepresentationRestitution = {
            ...reponseHATEOAS,
            ...(restitution as RestitutionHTML),
          };
          return reponse.json(resultat);
        }
      };

      return configuration.entrepots
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
