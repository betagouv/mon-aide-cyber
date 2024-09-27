import { ConfigurationServeur } from '../../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from '../routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { secteursActivite } from '../../espace-aidant/preferences/secteursActivite';
import { departements } from '../../gestion-demandes/departements';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { typesEntites, TypesEntites } from '../../authentification/Aidant';
import bodyParser from 'body-parser';
import { ServicePreferencesAidant } from '../../espace-aidant/preferences/ServicePreferencesAidant';

export type ReponsePreferencesAidantAPI = ReponseHATEOAS & {
  preferencesAidant: {
    secteursActivite: string[];
    departements: string[];
    typesEntites: string[];
  };
  referentiel: {
    secteursActivite: string[];
    departements: { code: string; nom: string }[];
    typesEntites: TypesEntites;
  };
};

export const routesAPIAidantPreferences = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();
  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    entrepots,
  } = configuration;

  routes.get(
    '/',
    session.verifie('Accède aux préférences de l’Aidant'),
    cgu.verifie(),
    async (
      requete: RequeteUtilisateur,
      reponse: Response<ReponsePreferencesAidantAPI>,
      suite: NextFunction
    ) => {
      entrepots
        .aidants()
        .lis(requete.identifiantUtilisateurCourant!)
        .then((aidant) => {
          reponse.json({
            preferencesAidant: {
              secteursActivite: aidant.preferences.secteursActivite.map(
                (s) => s.nom
              ),
              departements: aidant.preferences.departements.map((d) => d.nom),
              typesEntites: aidant.preferences.typesEntites.map((t) => t.nom),
            },
            referentiel: {
              secteursActivite: secteursActivite.map((s) => s.nom),
              departements: departements.map((d) => ({
                code: d.code,
                nom: d.nom,
              })),
              typesEntites,
            },
            ...constructeurActionsHATEOAS().modifierPreferences().construis(),
          });
        })
        .catch((erreur) => {
          suite(ErreurMAC.cree('Accède aux préférences de l’Aidant', erreur));
        });
    }
  );

  routes.patch(
    '/',
    session.verifie('Modifie les préférences de l’Aidant'),
    cgu.verifie(),
    bodyParser.json(),
    async (
      requete: RequeteUtilisateur<PatchRequestPreferencesAidant>,
      reponse: Response<ReponsePreferencesAidantAPI>,
      suite: NextFunction
    ) => {
      new ServicePreferencesAidant(entrepots.aidants())
        .metsAJour({
          identifiantAidant: requete.identifiantUtilisateurCourant!,
          preferences: { ...requete.body.preferencesAidant },
        })
        .then(() => reponse.status(204).send())
        .catch((erreur) =>
          suite(ErreurMAC.cree('Modifie les préférences de l’Aidant', erreur))
        );
    }
  );

  return routes;
};

type PatchRequestPreferencesAidant = {
  preferencesAidant: {
    secteursActivite?: string[];
    departements?: string[];
    typesEntites: string[];
  };
};
