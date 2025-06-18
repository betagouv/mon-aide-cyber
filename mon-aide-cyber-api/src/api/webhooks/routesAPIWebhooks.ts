import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response, Router } from 'express';
import { Evenement } from '../../domaine/BusEvenement';
import bodyParser from 'body-parser';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

type CorpsReponseTallyRecue = {
  dateReponse: Date;
  nomFormulaire: string;
  reponses: { libelle: string; valeur: string }[];
};
export type ReponseTallyRecue = Evenement<CorpsReponseTallyRecue>;

export type Field = { label: string; value: string };
export type ReponseTally = {
  createdAt: string;
  data: {
    formName: string;
    fields: Field[];
  };
};

const mappeReponse = (reponseTally: ReponseTally): CorpsReponseTallyRecue => {
  return {
    dateReponse: FournisseurHorloge.enDate(reponseTally.createdAt),
    nomFormulaire: reponseTally.data.formName,
    reponses: reponseTally.data.fields.map((f) => ({
      libelle: f.label,
      valeur: f.value,
    })),
  };
};

const routesAPITally = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  const { busEvenement } = configuration;

  routes.post(
    '/',
    bodyParser.json(),
    (requete: Request<ReponseTally>, reponse: Response) => {
      busEvenement.publie<ReponseTallyRecue>({
        corps: mappeReponse(requete.body),
        date: FournisseurHorloge.maintenant(),
        identifiant: crypto.randomUUID(),
        type: 'REPONSE_TALLY_RECUE',
      });
      return reponse.sendStatus(202);
    }
  );

  return routes;
};

export const routesAPIWebhooks = (configuration: ConfigurationServeur) => {
  const routes: Router = express.Router();

  routes.use('/tally', routesAPITally(configuration));

  return routes;
};
