import { adaptateurEnvironnement } from './adaptateurEnvironnement';
import { AdaptateurRepertoireDeContactsBrevo } from '../infrastructure/adaptateurs/AdaptateurRepertoireDeContactsBrevo';
import { AdaptateurRepertoireDeContactsMemoire } from '../infrastructure/adaptateurs/AdaptateurRepertoireDeContactsMemoire';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export const adaptateurRepertoireDeContacts = (): RepertoireDeContacts =>
  adaptateurEnvironnement.messagerie().clefAPI() !== ''
    ? new AdaptateurRepertoireDeContactsBrevo()
    : new AdaptateurRepertoireDeContactsMemoire();
