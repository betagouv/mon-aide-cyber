import express, { NextFunction, Request, Response, Router } from 'express';
import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';
import {
  Departement,
  listeDepartements,
} from '../../infrastructure/departements/listeDepartements/listeDepartements';

export const routesAPIDemandesDevenirAidant = () => {
  const routes: Router = express.Router();

  routes.get('/', async (_requete: Request, reponse: Response) => {
    const extraitNomsEtCodes = (departements: Departement[]) =>
      departements.map(({ nom, code }) => ({
        nom,
        code,
      }));

    return reponse.status(200).json({
      departements: extraitNomsEtCodes(listeDepartements),
    });
  });

  routes.post(
    '/',
    express.json(),
    body('nom').notEmpty().trim().withMessage('Veuillez renseigner votre nom'),
    body('prenom')
      .notEmpty()
      .trim()
      .withMessage('Veuillez renseigner votre prénom'),
    body('mail')
      .isEmail()
      .trim()
      .withMessage('Veuillez renseigner votre e-mail'),
    body('departement')
      .notEmpty()
      .trim()
      .withMessage('Veuillez renseigner un département'),
    async (requete: Request, reponse: Response, _suite: NextFunction) => {
      const resultatsValidation: Result<FieldValidationError> =
        validationResult(requete) as Result<FieldValidationError>;

      if (!resultatsValidation.isEmpty()) {
        reponse.status(422);

        reponse.json({
          message: resultatsValidation
            .array()
            .map((resultatValidation) => resultatValidation.msg)
            .join(', '),
        });

        return reponse.send();
      }

      reponse.status(200);

      return reponse.send();
    }
  );

  return routes;
};
