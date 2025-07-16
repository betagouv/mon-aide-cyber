import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response, Router } from 'express';
import { Evenement } from '../../domaine/BusEvenement';
import bodyParser from 'body-parser';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import * as core from 'express-serve-static-core';
import {
  ActivationCompteAidantFaite,
  SagaActivationCompteAidant,
} from '../../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';

export type CorpsReponseTallyRecue = {
  dateReponse: string;
  nomFormulaire: string;
  reponses: { libelle: string; valeur: string }[];
};
export type ReponseTallyRecue = Evenement<CorpsReponseTallyRecue>;

export type Field = { label: string; value: string; type: string };
export type ReponseTally = {
  createdAt: string;
  data: {
    formName: string;
    fields: Field[];
  };
};

const mappeReponse = (reponseTally: ReponseTally): CorpsReponseTallyRecue => {
  return {
    dateReponse: reponseTally.createdAt,
    nomFormulaire: reponseTally.data.formName,
    reponses: reponseTally.data.fields
      .filter((f) => f.type !== 'TEXTAREA')
      .map((f) => ({
        libelle: f.label,
        valeur: f.value,
      })),
  };
};

const routesAPITally = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  const { busEvenement, adaptateurSignatureRequete } = configuration;

  routes.post(
    '/',
    bodyParser.json(),
    adaptateurSignatureRequete.verifie(),
    async (
      requete: Request<core.ParamsDictionary & ReponseTally>,
      reponse: Response
    ) => {
      const reponseTally = requete.body;
      await busEvenement.publie<ReponseTallyRecue>({
        corps: mappeReponse(reponseTally),
        date: FournisseurHorloge.maintenant(),
        identifiant: crypto.randomUUID(),
        type: 'REPONSE_TALLY_RECUE',
      });
      return reponse.sendStatus(202);
    }
  );

  return routes;
};

export type CorpsFinAtelierLivestorm = {
  webinar: {
    created_at: string;
    title: string;
    attendees: { email: string }[];
  };
};

const routesAPILiveStorm = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  const { entrepots, busCommande } = configuration;

  routes.post(
    '/',
    bodyParser.json(),
    async (
      requete: Request<core.ParamsDictionary & CorpsFinAtelierLivestorm>,
      reponse: Response
    ) => {
      const corpsFinAtelierLivestorm: CorpsFinAtelierLivestorm = requete.body;
      const toutesLesActivations =
        corpsFinAtelierLivestorm.webinar.attendees.map(async (a) => {
          const demandeDevenirAidant = await entrepots
            .demandesDevenirAidant()
            .rechercheDemandeEnCoursParMail(a.email);
          if (demandeDevenirAidant) {
            return busCommande.publie<
              SagaActivationCompteAidant,
              ActivationCompteAidantFaite
            >({
              mail: demandeDevenirAidant.mail,
              type: 'SagaActivationCompteAidant',
            });
          }
          return undefined;
        });

      await Promise.all(toutesLesActivations);

      return reponse.sendStatus(200);
    }
  );

  return routes;
};

export const routesAPIWebhooks = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/tally', routesAPITally(configuration));
  routes.use('/livestorm', routesAPILiveStorm(configuration));

  return routes;
};
