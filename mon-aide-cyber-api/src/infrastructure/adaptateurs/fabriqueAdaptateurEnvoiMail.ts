import { AdaptateurEnvoiMailBrevo } from './AdaptateurEnvoiMailBrevo';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { AdaptateurEnvoiMailMemoire } from './AdaptateurEnvoiMailMemoire';

export const fabriqueAdaptateurEnvoiMail = (): AdaptateurEnvoiMail =>
  process.env.BREVO_CLEF_API
    ? new AdaptateurEnvoiMailBrevo()
    : new AdaptateurEnvoiMailMemoire();
