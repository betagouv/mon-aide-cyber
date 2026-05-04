import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response, Router } from 'express';
import * as core from 'express-serve-static-core';
import {
  ActivationCompteAidantFaite,
  SagaActivationCompteAidant,
} from '../../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { z } from 'zod/v4';
import { valideLaCoherenceDuCorps } from '../ValideLaCoherenceDuCorps';

export type CorpsParticipantFinAtelierLivestorm = {
  data: {
    type: 'people';
    attributes: {
      registrant_detail: {
        event_id?: string;
        fields: {
          id: string;
          value: string;
        }[];
      };
    };
  };
};

const schemaLivestorm = z.object({
  data: z.object({
    type: z.literal('people'),
    attributes: z.object({
      registrant_detail: z.object({
        event_id: z.any().superRefine((val, ctx) => {
          if (
            val !==
            adaptateurEnvironnement.webinaires().livestorm()
              .idEvenementAteliersDevenirAidant
          ) {
            ctx.addIssue({
              code: 'custom',
              message: 'Pas notre webinaire',
            });
            return z.NEVER;
          }
        }),
        fields: z
          .array(
            z.object({
              id: z.string(),
              value: z.string(),
            })
          )
          .superRefine((champs, ctx) => {
            const email = champs.find((f) => f.id === 'email')?.value;
            if (!email || !z.email().safeParse(email).success) {
              ctx.addIssue({
                code: 'custom',
                message: "L'email est obligatoire",
              });
              return z.NEVER;
            }
          }),
      }),
    }),
  }),
});

export const routesAPILiveStorm = (configuration: ConfigurationServeur) => {

  const routes: Router = express.Router();

  const { busCommande, adaptateurSignatureRequete } = configuration;
  routes.post(
    '/activation-compte-aidant',
    express.json({limit: '10kb'}),
    valideLaCoherenceDuCorps(
      schemaLivestorm,
      { statut: 204 }
    ),
    adaptateurSignatureRequete.verifie('LIVESTORM'),
    async (
      requete: Request<
        core.ParamsDictionary & CorpsParticipantFinAtelierLivestorm
      >,
      reponse: Response
    ) => {
      const corpsParticipantFinAtelierLivestorm: CorpsParticipantFinAtelierLivestorm =
        requete.body;

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
