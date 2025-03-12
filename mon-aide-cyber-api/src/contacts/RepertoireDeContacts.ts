import { Aidant } from '../espace-aidant/Aidant';

export interface RepertoireDeContacts {
  creeAidant: (aidant: Aidant) => Promise<void>;
}
