import { ConsignateurErreurs } from '../../adaptateurs/ConsignateurErreurs';
import * as Sentry from '@sentry/node';

export class ConsignateurErreursSentry implements ConsignateurErreurs {
  consigne(erreur: Error): void {
    Sentry.withScope(() => {
      Sentry.captureException(erreur);
    });
  }

  tous(): Error[] {
    return [];
  }
}
