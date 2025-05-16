import { ConfigurationServeur } from '../../serveur';
import express, { NextFunction, Request, Response } from 'express';
import {
  CommandeAttribueDemandeAide,
  DemandeAideDejaPourvue,
} from '../../gestion-demandes/aide/CapteurCommandeAttribueDemandeAide';
import * as core from 'express-serve-static-core';
import {
  tokenAttributionDemandeAide,
  TonkenAttributionDemandeAide,
} from '../../gestion-demandes/aide/MiseEnRelationParCriteres';
import { DemandePourPostuler } from './miseEnRelation';
import { ErreurMAC } from '../../domaine/erreurMAC';

type CorpsRequeteRepondreAUneDemande = core.ParamsDictionary & {
  token: string;
};

export class ErreurPostulerTokenInvalide extends Error {
  constructor(token: string, erreur: Error) {
    super(
      `Reçu un token invalide : ${token} (probablement manipulation humaine)`,
      { cause: erreur }
    );
  }
}

export class ErreurPostulerTokenSansDemande extends Error {
  constructor(token: string) {
    super(
      `Reçu token valide mais impossible de trouver la demande associée : ${token}`
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
      let tokenEnClair: TonkenAttributionDemandeAide | undefined = undefined;
      try {
        tokenEnClair =
          tokenAttributionDemandeAide(serviceDeChiffrement).dechiffre(token);
      } catch (erreur: unknown | Error) {
        return suite(
          ErreurMAC.cree(
            "Postuler à une demande d'aide",
            new ErreurPostulerTokenInvalide(token, erreur as Error)
          )
        );
      }

      const demandeAide = await entrepots
        .demandesAides()
        .rechercheParEmail(tokenEnClair.demande);

      if (demandeAide.etat !== 'COMPLET') {
        return suite(
          ErreurMAC.cree(
            "Postuler à une demande d'aide",
            new ErreurPostulerTokenSansDemande(token)
          )
        );
      }

      const demande = demandeAide.demandeAide;

      const [entreprise] =
        await adaptateurRechercheEntreprise.rechercheEntreprise(
          demande.siret,
          ''
        );

      return reponse.json({
        dateCreation: demande.dateSignatureCGU.toISOString(),
        departement: demande.departement,
        typeEntite: entreprise?.typeEntite.nom ?? 'Information indisponible',
        secteurActivite:
          entreprise?.secteursActivite.map((s) => s.nom).join(', ') ??
          'Information indisponible',
      });
    }
  );

  return routes;
};
