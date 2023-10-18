import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { AggregatNonTrouve } from "../../domaine/Aggregat";
import { AdapteurGestionnaireErreurs } from "../../adaptateurs/AdapteurGestionnaireErreurs";

export const gestionnaireErreurAggregatNonTrouve = (
  gestionnaireErreurs: AdapteurGestionnaireErreurs,
) => {
  return (
    erreur: Error,
    _requete: Request,
    reponse: Response,
    suite: NextFunction,
  ) => {
    if (erreur instanceof AggregatNonTrouve) {
      gestionnaireErreurs.consigne(erreur);

      if (reponse.headersSent) {
        return suite(erreur);
      }

      reponse.status(404);
      reponse.json({ message: erreur.message });
    }
  };
};
