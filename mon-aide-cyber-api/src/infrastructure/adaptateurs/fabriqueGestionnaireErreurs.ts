import { AdaptateurGestionnaireErreurs } from '../../adaptateurs/AdaptateurGestionnaireErreurs';
import { AdaptateurGestionnaireErreursSentry } from './AdaptateurGestionnaireErreursSentry';
import { AdaptateurGestionnaireErreursMemoire } from './AdaptateurGestionnaireErreursMemoire';

export const fabriqueGestionnaireErreurs = (): AdaptateurGestionnaireErreurs => {
  return process.env.SENTRY_DSN
    ? new AdaptateurGestionnaireErreursSentry()
    : new AdaptateurGestionnaireErreursMemoire();
};
