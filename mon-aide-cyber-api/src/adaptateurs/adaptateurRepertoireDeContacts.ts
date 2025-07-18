import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { AdaptateurRepertoireDeContactsBrevo } from '../infrastructure/adaptateurs/AdaptateurRepertoireDeContactsBrevo';
import { AdaptateurRepertoireDeContactsMemoire } from '../infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export const adaptateurRepertoireDeContacts = (): RepertoireDeContacts =>
  adaptateurEnvironnement.messagerie().brevo().clefAPI() !== ''
    ? new AdaptateurRepertoireDeContactsBrevo()
    : new AdaptateurRepertoireDeContactsMemoire();
