import {
  AdaptateurGestionnaireErreurs,
  ControleurGestionnaireErreurs,
} from "../../adaptateurs/AdaptateurGestionnaireErreurs";
import { ConsignateurErreursMemoire } from "./ConsignateurErreursMemoire";
import { ConsignateurErreurs } from "../../adaptateurs/ConsignateurErreurs";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";

export class AdaptateurGestionnaireErreursMemoire
  implements AdaptateurGestionnaireErreurs
{
  private readonly _consignateur = new ConsignateurErreursMemoire();

  consignateur(): ConsignateurErreurs {
    return this._consignateur;
  }

  controleurRequete(): ControleurGestionnaireErreurs {
    return (
      _erreur: Error,
      requete: Request,
      _reponse: Response,
      suite: NextFunction,
    ) => {
      suite(requete);
    };
  }

  controleurErreurs(): ControleurGestionnaireErreurs {
    return (
      erreur: Error,
      _requete: Request,
      _reponse: Response,
      suite: NextFunction,
    ) => {
      suite(erreur);
    };
  }
}
