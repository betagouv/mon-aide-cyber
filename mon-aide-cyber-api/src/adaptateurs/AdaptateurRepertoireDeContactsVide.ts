import { Aidant } from '../espace-aidant/Aidant';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export class RepertoireDeContactsVide implements RepertoireDeContacts {
  async creeAidant(aidant: Aidant): Promise<void> {
    console.log('Je créé un nouveau contact', aidant.email);
  }
}
