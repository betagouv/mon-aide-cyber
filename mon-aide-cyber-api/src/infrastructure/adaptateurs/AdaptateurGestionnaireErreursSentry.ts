import * as Sentry from '@sentry/node';
import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { sentry } from '../../adaptateurs/adaptateurEnvironnement';
import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import { ConsignateurErreursSentry } from './ConsignateurErreursSentry';
import { ErrorRequestHandler, Express, RequestHandler } from 'express';

export class AdaptateurGestionnaireErreursSentry
  implements AdaptateurGestionnaireErreurs
{
  private readonly _consignateur;
  constructor() {
    this._consignateur = new ConsignateurErreursSentry();
  }

  initialise(applicationExpress: Express): void {
    Sentry.init({
      dsn: sentry().dsn() || '',
      environment: sentry().environnement() || '',
      integrations: [
        new Sentry.Integrations.Express({ app: applicationExpress }),
        new Sentry.Integrations.Postgres(),
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],
      tracesSampleRate: sentry().tracesSampleRate(),
    });

    applicationExpress.use(Sentry.Handlers.requestHandler());
    applicationExpress.use(Sentry.Handlers.tracingHandler());
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
