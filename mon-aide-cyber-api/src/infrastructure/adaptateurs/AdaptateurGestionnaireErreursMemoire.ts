import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { ConsignateurErreursMemoire } from './ConsignateurErreursMemoire';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import {
  ErrorRequestHandler,
  Express,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurGestionnaireErreursMemoire
  implements AdaptateurGestionnaireErreurs
{
  initialise(_applicationExpress: Express): void {
    console.log('Initialise le gestionnaire d’erreur');
  }
  private readonly _consignateur = new ConsignateurErreursMemoire();

  consignateur(): ConsignateurErreurs {
    return this._consignateur;
  }

  controleurRequete(): RequestHandler {
    return (_requete: Request, _reponse: Response, suite: NextFunction) =>
      suite();
  }

  controleurErreurs(): ErrorRequestHandler {
    return (
      erreur: Error,
      _requete: Request,
      _reponse: Response,
      _suite: NextFunction
    ) => {
      console.error('Une erreur est survenue: %s', erreur);
    };
  }
}
