import { ConfigurationServeur } from '../../serveur';
import express, { Request, Response } from 'express';
import {
  CommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
} from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import * as core from 'express-serve-static-core';

import { tokenAttributionDemandeAide } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';

import { DemandePourPostuler } from './miseEnRelation';

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

  routes.get(
    '/informations-de-demande',
    async (
      requete: Request,
      reponse: Response<DemandePourPostuler | { codeErreur: string }>
    ) => {
      if ((requete.query['token'] as string)?.startsWith('x')) {
        return reponse.status(400).json({ codeErreur: 'TOKEN_INVALIDE' });
      }
      return reponse.json({
        dateCreation: new Date('2025-05-15T15:30').toISOString(),
        departement: {
          nom: 'Gironde',
          code: '33',
          codeRegion: '75',
        },
        typeEntite: 'Entreprise privée',
        secteurActivite: 'Tertiaire',
      });
    }
  );

  return routes;
};
