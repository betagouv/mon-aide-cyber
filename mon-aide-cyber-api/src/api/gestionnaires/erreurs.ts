import { Request, Response } from "express";
import { AggregatNonTrouve } from "../../infrastructure/entrepots/memoire/EntrepotsMemoire";
import { NextFunction } from "express-serve-static-core";

export const gestionnaireErreurAggregatNonTrouve = (
  erreur: Error,
  _requete: Request,
  reponse: Response,
  suite: NextFunction,
) => {
  if (erreur instanceof AggregatNonTrouve) {
    if (reponse.headersSent) {
      return suite(erreur);
    }
    reponse.status(404);
    reponse.json({ message: erreur.message });
  }
};
