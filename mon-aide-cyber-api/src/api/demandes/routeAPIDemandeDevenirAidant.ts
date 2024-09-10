import express, { NextFunction, Request, Response, Router } from 'express';
import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import { ConfigurationServeur } from '../../serveur';
import { CommandeDevenirAidant } from '../../gestion-demandes/devenir-aidant/CapteurCommandeDevenirAidant';
import { validateurDeDepartement } from '../validateurs/departements';
import {
  nomsEtCodesDesDepartements,
  rechercheParNomDepartement,
} from '../../gestion-demandes/departements';
import { constructeurActionsHATEOAS } from '../hateoas/hateoas';
import { validateursDeCreationDeMotDePasse } from '../validateurs/motDePasse';

export const routesAPIDemandesDevenirAidant = (
  configuration: ConfigurationServeur
) => {
  const routes: Router = express.Router();

  routes.get('/', async (_requete: Request, reponse: Response) => {
    return reponse.status(200).json({
      departements: nomsEtCodesDesDepartements(),
      ...constructeurActionsHATEOAS().actionsDemandeDevenirAidant().construis(),
    });
  });

  routes.post(
    '/',
    express.json(),
    body('nom').trim().notEmpty().withMessage('Veuillez renseigner votre nom'),
    body('prenom')
      .trim()
      .notEmpty()
      .withMessage('Veuillez renseigner votre prénom'),
    body('mail')
      .trim()
      .isEmail()
      .withMessage('Veuillez renseigner votre e-mail'),
    validateurDeDepartement(),
    body('cguValidees')
      .custom((value: boolean) => value)
      .withMessage('Veuillez valider les CGU'),
    async (requete: Request, reponse: Response, suite: NextFunction) => {
      try {
        const resultatsValidation: Result<FieldValidationError> =
          validationResult(requete) as Result<FieldValidationError>;
        if (!resultatsValidation.isEmpty()) {
          reponse.status(422).json({
            message: resultatsValidation
              .array()
              .map((resultatValidation) => resultatValidation.msg)
              .join(', '),
          });
        }

        const commande: CommandeDevenirAidant = {
          type: 'CommandeDevenirAidant',
          departement: rechercheParNomDepartement(requete.body.departement),
          mail: requete.body.mail,
          nom: requete.body.nom,
          prenom: requete.body.prenom,
        };

        await configuration.busCommande.publie(commande);
        reponse.status(200);
        return reponse.send();
      } catch (error) {
        return suite(error);
      }
    }
  );

  routes.post(
    '/creation-compte',
    express.json(),
    validateursDeCreationDeMotDePasse(),
    async (requete: Request, reponse: Response, _suite: NextFunction) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;

      if (!resultatsValidation.isEmpty()) {
        return reponse.status(422).json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
        });
      }

      return reponse.status(201).json({
        ...constructeurActionsHATEOAS().actionsCreationCompte().construis(),
      });
    }
  );

  return routes;
};
