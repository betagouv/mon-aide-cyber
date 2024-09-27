import { ConfigurationServeur } from '../../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from '../routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { secteursActivite } from '../../espace-aidant/preferences/secteursActivite';
import { departements } from '../../gestion-demandes/departements';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';

export type ReponsePreferencesAidantAPI = ReponseHATEOAS & {
  preferencesAidant: {
    secteursActivite: string[];
    departements: { code: string; nom: string }[];
  };
  referentiel: {
    secteursActivite: string[];
    departements: { code: string; nom: string }[];
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
        .then(() => {
          reponse.json({
            preferencesAidant: {
              secteursActivite: [],
              departements: [],
            },
            referentiel: {
              secteursActivite: secteursActivite.map((s) => s.nom),
              departements: departements.map((d) => ({
                code: d.code,
                nom: d.nom,
              })),
            },
            ...constructeurActionsHATEOAS().modifierPreferences().construis(),
          });
        })
        .catch((erreur) => {
          suite(ErreurMAC.cree('Accède aux préférences de l’Aidant', erreur));
        });
    }
  );

  return routes;
};
