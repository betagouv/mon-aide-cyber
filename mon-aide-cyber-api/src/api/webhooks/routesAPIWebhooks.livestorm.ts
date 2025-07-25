import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response, Router } from 'express';
import bodyParser from 'body-parser';
import * as core from 'express-serve-static-core';
import {
  ActivationCompteAidantFaite,
  SagaActivationCompteAidant,
} from '../../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';

export type CorpsParticipantFinAtelierLivestorm = {
  data: {
    type: 'people';
    attributes: {
      registrant_detail: {
        fields: {
          id: string;
          value: string;
        }[];
      };
    };
  };
};

export const routesAPILiveStorm = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  const { busCommande, adaptateurSignatureRequete } = configuration;

  routes.post(
    '/activation-compte-aidant',
    bodyParser.json(),
    adaptateurSignatureRequete.verifie('LIVESTORM'),
    async (
      requete: Request<
        core.ParamsDictionary & CorpsParticipantFinAtelierLivestorm
      >,
      reponse: Response
    ) => {
      const corpsParticipantFinAtelierLivestorm: CorpsParticipantFinAtelierLivestorm =
        requete.body;

      if (corpsParticipantFinAtelierLivestorm.data.type !== 'people') {
        return reponse.sendStatus(204);
      }

      const emailParticipant =
        corpsParticipantFinAtelierLivestorm.data.attributes.registrant_detail.fields.find(
          (f) => f.id === 'email'
        )?.value;

      await busCommande.publie<
        SagaActivationCompteAidant,
        ActivationCompteAidantFaite
      >({
        mail: emailParticipant!,
        type: 'SagaActivationCompteAidant',
      });
      return reponse.sendStatus(200);
    }
  );

  return routes;
};
