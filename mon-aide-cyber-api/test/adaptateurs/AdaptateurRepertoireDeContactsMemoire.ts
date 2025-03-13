import { RepertoireDeContacts } from '../../src/contacts/RepertoireDeContacts';
import { Aidant } from '../../src/espace-aidant/Aidant';
import { UtilisateurInscrit } from '../../src/espace-utilisateur-inscrit/UtilisateurInscrit';
import { DemandeAide } from '../../src/gestion-demandes/aide/DemandeAide';

export class RepertoireDeContactsMemoire implements RepertoireDeContacts {
  public aidants: string[] = [];
  public aides: string[] = [];
  public utilisateursInscrits: string[] = [];

  async creeAidant(aidant: Aidant): Promise<void> {
    this.aidants.push(aidant.email);
  }

  async creeAide(aide: DemandeAide): Promise<void> {
    this.aides.push(aide.email);
  }

  async creeUtilisateurInscrit(utilisateur: UtilisateurInscrit): Promise<void> {
    this.utilisateursInscrits.push(utilisateur.email);
  }
}
