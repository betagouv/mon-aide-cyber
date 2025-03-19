import { RepertoireDeContacts } from '../../src/contacts/RepertoireDeContacts';

export class RepertoireDeContactsMemoire implements RepertoireDeContacts {
  public aidants: string[] = [];
  public aides: string[] = [];
  public utilisateursInscrits: string[] = [];

  async creeAidant(email: string): Promise<void> {
    this.aidants.push(email);
  }

  async creeAide(email: string): Promise<void> {
    this.aides.push(email);
  }

  async creeUtilisateurInscrit(email: string): Promise<void> {
    this.utilisateursInscrits.push(email);
  }
}
