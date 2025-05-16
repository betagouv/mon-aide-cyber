import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response } from 'express';
import {
  CommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
} from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import * as core from 'express-serve-static-core';
import { tokenAttributionDemandeAide } from '../../gestion-demandes/aide/MiseEnRelationParCriteres';
import { DemandePourPostuler } from './miseEnRelation';
import { ErreurMAC } from '../../domaine/erreurMAC';

type CorpsRequeteRepondreAUneDemande = core.ParamsDictionary & {
  token: string;
};

export class ErreurPostulerTokenInvalide extends Error {
  constructor(token: string) {
    super(
      `Reçu un token invalide : ${token} (probablement manipulation humaine)`
    );
  }
}

export const routesAPIAidantRepondreAUneDemande = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const {
    busCommande,
    entrepots,
    adaptateurRechercheEntreprise,
    serviceDeChiffrement,
  } = configuration;

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
      reponse: Response<DemandePourPostuler | { codeErreur: string }>,
      suite: NextFunction
    ) => {
      const token = requete.query['token'] as string;
      if (token?.startsWith('x')) {
        return suite(
          ErreurMAC.cree(
            "Demande d'aide",
            new ErreurPostulerTokenInvalide(token)
          )
        );
      }

      const tokenEnClair =
        tokenAttributionDemandeAide(serviceDeChiffrement).dechiffre(token);
      const demandeAide = await entrepots
        .demandesAides()
        .rechercheParEmail(tokenEnClair.demande);
      if (demandeAide.demandeAide) {
        const entreprises =
          await adaptateurRechercheEntreprise.rechercheEntreprise(
            demandeAide.demandeAide.siret,
            ''
          );
        return reponse.json({
          dateCreation: demandeAide.demandeAide.dateSignatureCGU.toISOString(),
          departement: demandeAide.demandeAide.departement,
          typeEntite: entreprises[0].typeEntite.nom,
          secteurActivite: entreprises[0].secteursActivite
            .map((s) => s.nom)
            .join(', '),
        });
      }
      return reponse.status(500).json({ codeErreur: 'NON_IMPLEMENTÉ' });
    }
  );

  return routes;
};
