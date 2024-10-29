import express, { Request, Response } from 'express';
import { ConfigurationServeur } from '../../serveur';
import { NextFunction } from 'express-serve-static-core';
import {
  CriteresDeRecherche,
  ServiceAnnuaireAidants,
} from '../../annuaire-aidants/ServiceAnnuaireAidants';
import { UUID } from 'crypto';
import { ParsedQs } from 'qs';
import { ReponseHATEOAS } from '../hateoas/hateoas';
import { departements } from '../../gestion-demandes/departements';
import { validateurDeDepartement } from '../validateurs/departements';
import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';

type AidantDTO = {
  identifiant: UUID;
  nomPrenom: string;
};

export type ReponseAPIAnnuaireAidantsSucces = ReponseHATEOAS & {
  aidants?: AidantDTO[];
  nombreAidants?: number;
  departements: { code: string; nom: string }[];
};
export type ReponseAPIAnnuaireAidantsErreur = ReponseHATEOAS & {
  message: string;
};
export type ReponseAPIAnnuaireAidants =
  | ReponseAPIAnnuaireAidantsSucces
  | ReponseAPIAnnuaireAidantsErreur;

export const routesAPIAnnuaireAidants = (
  configuration: ConfigurationServeur
) => {
  const routes = express.Router();

  const { entrepots } = configuration;

  routes.get(
    '/',
    validateurDeDepartement({
      nomChamp: 'departement',
      emplacement: 'PARAMETRE_REQUETE',
      presence: 'OPTIONELLE',
    }),
    async (
      requete: Request,
      reponse: Response<ReponseAPIAnnuaireAidants>,
      _suite: NextFunction
    ) => {
      const estCriteresDeRecherche = (
        criteresDeRecherche: CriteresDeRecherche | ParsedQs
      ): criteresDeRecherche is CriteresDeRecherche => {
        return criteresDeRecherche && !!criteresDeRecherche.departement;
      };

      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;
      if (!resultatsValidation.isEmpty()) {
        return reponse.status(400).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join('\n'),
          liens: {
            'afficher-annuaire-aidants': {
              url: '/api/annuaire-aidants',
              methode: 'GET',
            },
          },
        });
      }

      const criteresDeRecherche = estCriteresDeRecherche(requete.query)
        ? requete.query
        : undefined;
      return new ServiceAnnuaireAidants(entrepots.annuaireAidants())
        .recherche(criteresDeRecherche)
        .then((annuaire) =>
          reponse.status(200).json({
            ...(annuaire && {
              aidants: annuaire.map((a) => ({
                identifiant: a.identifiant,
                nomPrenom: a.nomPrenom,
              })),
            }),
            departements: departements.map((d) => ({
              code: d.code,
              nom: d.nom,
            })),
            ...(annuaire && { nombreAidants: annuaire.length }),
            liens: {
              'afficher-annuaire-aidants': {
                url: '/api/annuaire-aidants',
                methode: 'GET',
              },
              'afficher-annuaire-aidants-parametre': {
                url: `/api/annuaire-aidants${criteresDeRecherche ? `?departement=${criteresDeRecherche.departement}` : ''}`,
                methode: 'GET',
              },
              'solliciter-aide': {
                url: '/api/demandes/solliciter-aide',
                methode: 'POST',
              },
            },
          })
        );
    }
  );

  return routes;
};
