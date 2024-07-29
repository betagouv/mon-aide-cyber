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
    body('nom').notEmpty().trim().withMessage('Veuillez renseigner votre nom'),
    body('prenom')
      .notEmpty()
      .trim()
      .withMessage('Veuillez renseigner votre prénom'),
    body('mail')
      .isEmail()
      .trim()
      .withMessage('Veuillez renseigner votre e-mail'),
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
