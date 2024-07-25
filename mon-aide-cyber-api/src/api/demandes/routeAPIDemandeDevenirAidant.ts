import express, { NextFunction, Request, Response, Router } from 'express';

export const routesAPIDemandesDevenirAidant = () => {
  const routes: Router = express.Router();
  routes.post(
    '/',
    async (_requete: Request, reponse: Response, _suite: NextFunction) => {
      reponse.status(200);

      return reponse.send();
    }
  );

  return routes;
};
