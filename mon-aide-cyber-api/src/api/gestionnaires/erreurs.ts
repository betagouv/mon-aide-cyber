import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { AggregatNonTrouve } from "../../domaine/Aggregat";
import { AdapteurGestionnaireErreurs } from "../../adaptateurs/AdapteurGestionnaireErreurs";

export const gestionnaireErreurAggregatNonTrouve = () => {
  return (
    erreur: Error,
    _requete: Request,
    reponse: Response,
    suite: NextFunction,
  ) => {
    if (erreur instanceof AggregatNonTrouve) {
      reponse.status(404);
      reponse.json({ message: erreur.message });

      suite(erreur);
    }
  };
};

export const gestionnaireErreurGeneralisee = (
  gestionnaireErreurs: AdapteurGestionnaireErreurs,
) => {
  return (
    erreur: Error,
    _requete: Request,
    _reponse: Response,
    _suite: NextFunction,
  ) => {
    if (erreur) {
      gestionnaireErreurs.consigne(erreur);
    }
  };
};
