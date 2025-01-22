import express, { Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { ReponseHATEOAS } from '../hateoas/hateoas';
import {
  Diagnostic,
  ServiceTableauDeBord,
} from '../../espace-aidant/tableau-de-bord/ServiceTableauDeBord';
import { ConfigurationServeur } from '../../serveur';
import { RequeteUtilisateur } from '../routesAPI';
import { ServiceDiagnostic } from '../../diagnostic/ServiceDiagnostic';

export type ReponseDiagnostics = ReponseHATEOAS & {
  diagnostics: Diagnostic[];
};

export const routesAPITableauDeBord = (configuration: ConfigurationServeur) => {
  const routes = express.Router();
  const {
    adaptateurDeVerificationDeSession: session,
    adaptateurDeVerificationDeCGU: cgu,
  } = configuration;

  routes.get(
    '/',
    session.verifie('Accède au Tableau de Bord'),
    cgu.verifie(),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      __suite: NextFunction
    ) => {
      const tableauDeBord = await new ServiceTableauDeBord(
        configuration.adaptateurRelations,
        new ServiceDiagnostic(configuration.entrepots),
        !!requete.estProConnect
      ).pour(requete.identifiantUtilisateurCourant!);

      return reponse.status(200).json({
        diagnostics: tableauDeBord.diagnostics,
        ...tableauDeBord.liens,
      });
    }
  );

  return routes;
};
