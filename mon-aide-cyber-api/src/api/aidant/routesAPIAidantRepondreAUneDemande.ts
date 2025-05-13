import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import {
  CommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
} from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import * as core from 'express-serve-static-core';

import { tokenAttributionDemandeAide } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';

type CorpsRequeteRepondreAUneDemande = core.ParamsDictionary & {
  token: string;
};

export const routesAPIAidantRepondreAUneDemande = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { busCommande } = configuration;

  routes.post(
    '/',
    express.json(),
    async (
      requete: Request<CorpsRequeteRepondreAUneDemande>,
      reponse: Response
    ) => {
      try {
        const { demande, aidant } = tokenAttributionDemandeAide().dechiffre(
          requete.body.token
        );
        const commandeAttribueDemandeAide: CommandeAttribueDemandeAide = {
          type: 'CommandeAttribueDemandeAide',
          identifiantDemande: demande,
          identifiantAidant: aidant,
        };

        await busCommande.publie(commandeAttribueDemandeAide);

        return reponse.status(202).send();
      } catch (erreur: unknown | Error | DemandeAideDejaPourvue) {
        return reponse
          .status(400)
          .json({ message: (erreur as DemandeAideDejaPourvue).message });
      }
    }
  );

  return routes;
};
