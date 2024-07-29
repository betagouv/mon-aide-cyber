import express, { NextFunction, Request, Response, Router } from 'express';
import {
  body,
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';

export const routesAPIDemandesDevenirAidant = () => {
  const routes: Router = express.Router();
  routes.post(
    '/',
    express.json(),
    body('nom').exists().notEmpty().trim(),
    body('prenom').exists().notEmpty().trim(),
    body('mail').exists().notEmpty().isEmail().trim(),
    async (requete: Request, reponse: Response, _suite: NextFunction) => {
      const resultatValidation: Result<FieldValidationError> = validationResult(
        requete
      ) as Result<FieldValidationError>;

      if (!resultatValidation.isEmpty()) {
        reponse.status(422);

        if (resultatValidation.array()?.at(0)?.path === 'prenom') {
          reponse.json({
            message: 'Veuillez renseigner votre prénom',
          });
        } else if (resultatValidation.array()?.at(0)?.path === 'nom') {
          reponse.json({
            message: 'Veuillez renseigner votre nom',
          });
        } else {
          reponse.json({
            message: 'Veuillez renseigner votre e-mail',
          });
        }

        return reponse.send();
      }

      reponse.status(200);

      return reponse.send();
    }
  );

  return routes;
};
