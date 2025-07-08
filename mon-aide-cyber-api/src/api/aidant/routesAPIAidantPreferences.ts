import { ConfigurationServeur } from '../../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from '../routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { secteursActivite } from '../../espace-aidant/preferences/secteursActivite';
import { departements } from '../../gestion-demandes/departements';
import { constructeurActionsHATEOAS, ReponseHATEOAS } from '../hateoas/hateoas';
import { ErreurMAC } from '../../domaine/erreurMAC';
import { ServicePreferencesAidant } from '../../espace-aidant/preferences/ServicePreferencesAidant';
import {
  ExpressValidator,
  FieldValidationError,
  Meta,
  Result,
  validationResult,
} from 'express-validator';
import { typesEntites, TypesEntites } from '../../espace-aidant/Aidant';
import { valideLaConsistence } from '../validateurs/valideLaConsistence';

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

const valideLesPreferences = () => {
  const verifieLaValiditeDuChamp = (
    champsRecu: any,
    listeDeComparaison: string[],
    messageEnCasErreur: string
  ) => {
    if (!champsRecu) {
      return true;
    }
    const tousLesChampsRecus = champsRecu.every(
      (s: string) =>
        listeDeComparaison.filter((comparaison) => comparaison === s).length > 0
    );
    if (!tousLesChampsRecus) {
      throw new Error(messageEnCasErreur);
    }
    return true;
  };

  const { body } = new ExpressValidator({
    secteursActiviteExistants: (__: any, { req }: Meta) => {
      return verifieLaValiditeDuChamp(
        req.body.preferencesAidant.secteursActivite,
        secteursActivite.map((s) => s.nom),
        "Les secteurs d'activité sont erronés."
      );
    },
    departementsExistants: (__: any, { req }: Meta) => {
      return verifieLaValiditeDuChamp(
        req.body.preferencesAidant.departements,
        departements.map((d) => d.nom),
        'Les départements sont erronés.'
      );
    },
    typesEntitesExistants: (__: any, { req }: Meta) => {
      return verifieLaValiditeDuChamp(
        req.body.preferencesAidant.typesEntites,
        typesEntites.map((t) => t.nom),
        'Les types d’entites sont erronés.'
      );
    },
  });
  return [
    body()
      .secteursActiviteExistants()
      .withMessage("Les secteurs d'activité sont erronés.")
      .departementsExistants()
      .withMessage('Les départements sont erronés.')
      .typesEntitesExistants()
      .withMessage('Les types d’entités sont erronés.'),
  ];
};

export const routesAPIAidantPreferences = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();
  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
    entrepots,
    busEvenement,
  } = configuration;

  routes.get(
    '/',
    session.verifie('Accède aux préférences de l’Aidant'),
    cgu.verifie('Accède aux préférences de l’Aidant'),
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
            ...constructeurActionsHATEOAS()
              .pour({ contexte: 'aidant:modifier-preferences' })
              .pour({
                contexte: requete.estProConnect
                  ? 'se-deconnecter-avec-pro-connect'
                  : 'se-deconnecter',
              })
              .construis(),
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
    cgu.verifie('Modifie les préférences de l’Aidant'),
    express.json(),
    valideLesPreferences(),
    valideLaConsistence({
      champs: [
        {
          nom: 'preferencesAidant',
          champs: [
            { nom: 'secteursActivite' },
            { nom: 'departements' },
            { nom: 'typesEntites' },
          ],
        },
      ],
    }),
    async (
      requete: RequeteUtilisateur<PatchRequestPreferencesAidant>,
      reponse: Response<ReponsePreferencesAidantAPI>,
      suite: NextFunction
    ) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete
      ) as Result<FieldValidationError>;

      if (resultatValidation.isEmpty()) {
        return new ServicePreferencesAidant(entrepots.aidants(), busEvenement)
          .metsAJour({
            identifiantAidant: requete.identifiantUtilisateurCourant!,
            preferences: { ...requete.body.preferencesAidant },
          })
          .then(() => reponse.status(204).send())
          .catch((erreur) =>
            suite(ErreurMAC.cree('Modifie les préférences de l’Aidant', erreur))
          );
      }
      const erreursValidation = resultatValidation
        .array()
        .map((resultat) => resultat.msg)
        .filter((erreur): erreur is string => !!erreur);
      return suite(
        ErreurMAC.cree(
          'Modifie les préférences de l’Aidant',
          new ErreurModificationPreferences(erreursValidation.join('\n'))
        )
      );
    }
  );

  return routes;
};

export class ErreurModificationPreferences extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

type PatchRequestPreferencesAidant = {
  preferencesAidant: {
    secteursActivite?: string[];
    departements?: string[];
    typesEntites: string[];
  };
};
