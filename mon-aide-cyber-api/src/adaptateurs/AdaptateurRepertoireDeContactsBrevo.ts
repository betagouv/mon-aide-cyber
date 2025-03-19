import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';
import {
  AdaptateursRequeteBrevo,
  adaptateursRequeteBrevo,
} from '../infrastructure/adaptateurs/adaptateursRequeteBrevo';
import { unConstructeurCreationDeContact } from '../infrastructure/brevo/ConstructeursBrevo';

export class AdaptateurRepertoireDeContactsBrevo
  implements RepertoireDeContacts
{
  private brevo: AdaptateursRequeteBrevo;

  constructor() {
    this.brevo = adaptateursRequeteBrevo();
  }

  private async creeContact(
    email: string,
    profil: 'AIDANT' | 'AIDE' | 'UTILISATEUR_INSCRIT'
  ) {
    await this.brevo
      .creationContact()
      .execute(
        unConstructeurCreationDeContact()
          .ayantPourEmail(email)
          .ayantPourAttributs({ MAC_PROFIL: profil })
          .construis()
      );
  }

  async creeAidant(email: string): Promise<void> {
    await this.creeContact(email, 'AIDANT');
  }

  async creeAide(email: string): Promise<void> {
    await this.creeContact(email, 'AIDE');
  }

  async creeUtilisateurInscrit(email: string): Promise<void> {
    await this.creeContact(email, 'UTILISATEUR_INSCRIT');
  }
}
