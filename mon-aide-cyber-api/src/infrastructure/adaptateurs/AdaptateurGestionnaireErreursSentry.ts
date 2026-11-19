import * as Sentry from '@sentry/node';
import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { sentry } from '../../adaptateurs/adaptateurEnvironnement';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import { ConsignateurErreursSentry } from './ConsignateurErreursSentry';
import { ErrorRequestHandler } from 'express';

export class AdaptateurGestionnaireErreursSentry implements AdaptateurGestionnaireErreurs {
  private readonly _consignateur;
  constructor() {
    this._consignateur = new ConsignateurErreursSentry();
  }

  initialise(): void {
    Sentry.init({
      dsn: sentry().dsn() || '',
      environment: sentry().environnement() || '',
      tracesSampleRate: sentry().tracesSampleRate(),
      maxValueLength: 50_000,
    });
  }

  consignateur(): ConsignateurErreurs {
    return this._consignateur;
  }

  controleurErreurs(): ErrorRequestHandler {
    return (erreur, _requete, _reponse, suite) => {
      Sentry.captureException(erreur);
      suite(erreur);
    };
  }
}
