import express, { NextFunction, Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';

export const routesAPIDemandesDevenirAidant = () => {
  const routes: Router = express.Router();
  routes.post(
    '/',
    express.json(),
    body('nom').exists().notEmpty().trim(),
    async (requete: Request, reponse: Response, _suite: NextFunction) => {
      const resultatValidation = validationResult(requete);

      if (!resultatValidation.isEmpty()) {
        reponse.status(422);

        reponse.json({
          message: 'Veuillez renseigner votre nom',
        });

        return reponse.send();
      }

      reponse.status(200);

      return reponse.send();
    }
  );

  return routes;
};
