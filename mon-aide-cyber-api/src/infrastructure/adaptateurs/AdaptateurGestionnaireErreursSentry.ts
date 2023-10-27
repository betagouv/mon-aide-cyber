import * as Sentry from '@sentry/node';
import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { sentry } from '../../adaptateurs/adaptateurEnvironnement';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import { ConsignateurErreursSentry } from './ConsignateurErreursSentry';
import { ErrorRequestHandler, RequestHandler } from 'express';

export class AdaptateurGestionnaireErreursSentry
  implements AdaptateurGestionnaireErreurs
{
  private readonly _consignateur;
  constructor() {
    Sentry.init({
      dsn: sentry().dsn() || '',
      environment: sentry().environnement() || '',
    });
    this._consignateur = new ConsignateurErreursSentry();
  }
  consignateur(): ConsignateurErreurs {
    return this._consignateur;
  }

  controleurErreurs(): ErrorRequestHandler {
    return Sentry.Handlers.errorHandler();
  }

  controleurRequete(): RequestHandler {
    return Sentry.Handlers.requestHandler();
  }
}
