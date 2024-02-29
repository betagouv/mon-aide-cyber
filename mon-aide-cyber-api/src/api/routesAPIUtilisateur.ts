import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import { ErreurMAC } from '../domaine/erreurMAC';
export const routesAPIUtilisateur = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots, adaptateurDeVerificationDeSession: session } =
    configuration;

  routes.get(
    '/',
    session.verifie("Accède aux informations de l'utilisateur"),
    async (
      requete: RequeteUtilisateur,
      reponse: Response,
      suite: NextFunction,
    ) => {
      return entrepots
        .aidants()
        .lis(requete.identifiantUtilisateurCourant!)
        .then((aidant) => {
          const actionsHATEOAS = constructeurActionsHATEOAS();
          reponse.status(200).json({
            ...(aidant.dateSignatureCGU
              ? {
                  ...actionsHATEOAS
                    .lancerDiagnostic()
                    .afficherProfil()
                    .construis(),
                }
              : { ...actionsHATEOAS.creerEspaceAidant().construis() }),
            nomPrenom: aidant.nomPrenom,
          });
        })
        .catch((erreur) =>
          suite(
            ErreurMAC.cree("Accède aux informations de l'utilisateur", erreur),
          ),
        );
    },
  );

  return routes;
};
