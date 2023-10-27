import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { ConsignateurErreursMemoire } from './ConsignateurErreursMemoire';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import {
  ErrorRequestHandler,
  Request,
  RequestHandler,
  Response,
} from 'express';
import { NextFunction } from 'express-serve-static-core';

export class AdaptateurGestionnaireErreursMemoire
  implements AdaptateurGestionnaireErreurs
{
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
      _erreur: Error,
      _requete: Request,
      _reponse: Response,
      _suite: NextFunction,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ) => {};
  }
}
