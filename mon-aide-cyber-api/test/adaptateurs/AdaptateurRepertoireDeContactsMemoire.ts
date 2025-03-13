import { RepertoireDeContacts } from '../../src/contacts/RepertoireDeContacts';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { DemandeAide } from '../../src/gestion-demandes/aide/DemandeAide';

export class RepertoireDeContactsMemoire implements RepertoireDeContacts {
  public aidants: string[] = [];
  public aides: string[] = [];

  async creeAidant(aidant: Aidant): Promise<void> {
    this.aidants.push(aidant.email);
  }

  async creeAide(aide: DemandeAide): Promise<void> {
    this.aides.push(aide.email);
  }
}
