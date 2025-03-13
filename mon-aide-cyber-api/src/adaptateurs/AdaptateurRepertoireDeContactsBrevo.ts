import { Aidant } from '../espace-aidant/Aidant';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';
import {
  AdaptateursRequeteBrevo,
  adaptateursRequeteBrevo,
} from '../infrastructure/adaptateurs/adaptateursRequeteBrevo';
import { unConstructeurCreationDeContact } from '../infrastructure/brevo/ConstructeursBrevo';
import { DemandeAide } from '../gestion-demandes/aide/DemandeAide';
import { UtilisateurInscrit } from '../espace-utilisateur-inscrit/UtilisateurInscrit';

export class AdaptateurRepertoireDeContactsBrevo
  implements RepertoireDeContacts
{
  private brevo: AdaptateursRequeteBrevo;

  constructor() {
    this.brevo = adaptateursRequeteBrevo();
  }

  private async creeContact(email: string, profil: { MAC_PROFIL: string }) {
    await this.brevo
      .creationContact()
      .execute(
        unConstructeurCreationDeContact()
          .ayantPourEmail(email)
          .ayantPourAttributs(profil)
          .construis()
      );
  }

  async creeAidant(aidant: Aidant): Promise<void> {
    await this.creeContact(aidant.email, { MAC_PROFIL: 'AIDANT' });
  }

  async creeAide(aide: DemandeAide): Promise<void> {
    await this.creeContact(aide.email, { MAC_PROFIL: 'AIDE' });
  }

  async creeUtilisateurInscrit(utilisateur: UtilisateurInscrit): Promise<void> {
    await this.creeContact(utilisateur.email, {
      MAC_PROFIL: 'UTILISATEUR_INSCRIT',
    });
  }
}
