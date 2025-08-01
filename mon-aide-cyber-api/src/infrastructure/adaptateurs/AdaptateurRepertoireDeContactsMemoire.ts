import {
  Evenement,
  RepertoireDeContacts,
} from '../../contacts/RepertoireDeContacts';

export class AdaptateurRepertoireDeContactsMemoire
  implements RepertoireDeContacts
{
  public aidants: string[] = [];
  public aides: string[] = [];
  public utilisateursInscrits: string[] = [];
  public evenements: Evenement[] = [];

  async creeAidant(email: string): Promise<void> {
    this.aidants.push(email);
  }

  async creeAide(email: string): Promise<void> {
    this.aides.push(email);
  }

  async creeUtilisateurInscrit(email: string): Promise<void> {
    this.utilisateursInscrits.push(email);
  }

  async emetsEvenement(evenement: Evenement): Promise<void> {
    this.evenements.push(evenement);
  }

  async modifieEmail(
    __ancienEmail: string,
    __nouvelEmail: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
