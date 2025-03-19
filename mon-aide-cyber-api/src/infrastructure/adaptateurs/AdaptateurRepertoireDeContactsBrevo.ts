import {
  Evenement,
  RepertoireDeContacts,
} from '../../contacts/RepertoireDeContacts';
import {
  AdaptateursRequeteBrevo,
  adaptateursRequeteBrevo,
} from './adaptateursRequeteBrevo';
import { unConstructeurCreationDeContact } from '../brevo/ConstructeursBrevo';

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

  emetsEvenement(_evenement: Evenement): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
