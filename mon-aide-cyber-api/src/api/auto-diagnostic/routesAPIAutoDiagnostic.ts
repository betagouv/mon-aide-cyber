import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import crypto from 'crypto';
import { SagaLanceAutoDiagnostic } from '../../auto-diagnostic/CapteurSagaLanceAutoDiagnostic';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';
import { representeLeDiagnosticPourLeClient } from '../representateurs/representateurDiagnostic';
import { ReponseHATEOAS, ReponseHATEOASEnErreur } from '../hateoas/hateoas';
import { RepresentationDiagnostic } from '../representateurs/types';
import {
  FieldValidationError,
  Result,
  body,
  validationResult,
} from 'express-validator';

type CorpsReponseAutoDiagnostic = ReponseHATEOAS & RepresentationDiagnostic;

export type CorpsReponseCreerAutoDiagnosticEnErreur = ReponseHATEOASEnErreur;

export const routesAPIAutoDiagnostic = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { busCommande } = configuration;

  routes.post(
    '/',
    express.json(),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Veuillez renseigner votre e-mail.'),
    body('cguSignees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez signer les CGU.'),
    (
      requete: Request,
      reponse: Response<CorpsReponseCreerAutoDiagnosticEnErreur>,
      _suite: NextFunction
    ) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
          liens: {
            'creer-auto-diagnostic': {
              methode: 'POST',
              url: '/api/auto-diagnostic',
            },
          },
        });
      }
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
