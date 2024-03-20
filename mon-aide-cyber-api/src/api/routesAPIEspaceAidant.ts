import { ConfigurationServeur } from '../serveur';
import express, { Response } from 'express';
import { FieldValidationError, Result, validationResult } from 'express-validator';
import { RequeteUtilisateur } from './routesAPI';
import { NextFunction } from 'express-serve-static-core';
import { ServiceCreationEspaceAidant } from '../espace-aidant/ServiceCreationEspaceAidant';
import { constructeurActionsHATEOAS } from './hateoas/hateoas';
import { ErreurMAC } from '../domaine/erreurMAC';
import { ErreurCreationEspaceAidant } from '../authentification/Aidant';
import { validateursDeMotDePasseTemporaire } from './validateurs/validateurs';

export const routesAPIEspaceAidant = (configuration: ConfigurationServeur) => {
  const routes = express.Router();

  const { entrepots, adaptateurDeVerificationDeSession: session } = configuration;

  type CorpsRequeteCreationEspaceAidant = {
    cguSignees: boolean;
    motDePasse: string;
  };

  routes.post(
    '/cree',
    express.json(),
    session.verifie("Crée l'espace Aidant"),
    validateursDeMotDePasseTemporaire(entrepots, 'motDePasse', 'motDePasseTemporaire'),
    async (requete: RequeteUtilisateur, reponse: Response, suite: NextFunction) => {
      try {
        const resultatValidation: Result<FieldValidationError> = validationResult(
          requete,
        ) as Result<FieldValidationError>;
        if (resultatValidation.isEmpty()) {
          const creationEspaceAidant: CorpsRequeteCreationEspaceAidant = requete.body;
          await new ServiceCreationEspaceAidant(entrepots).cree({
            ...creationEspaceAidant,
            identifiant: requete.identifiantUtilisateurCourant!,
          });
          reponse.status(200).json({
            ...constructeurActionsHATEOAS().tableauDeBord().lancerDiagnostic().afficherProfil().construis(),
          });
          return reponse.send();
        }
        const erreursValidation = resultatValidation
          .array()
          .map((resultat) => resultat.msg)
          .filter((erreur): erreur is string => !!erreur);
        return suite(
          ErreurMAC.cree("Crée l'espace Aidant", new ErreurCreationEspaceAidant(erreursValidation.join('\n'))),
        );
      } catch (erreur) {
        suite(erreur);
      }
    },
  );

  return routes;
};
