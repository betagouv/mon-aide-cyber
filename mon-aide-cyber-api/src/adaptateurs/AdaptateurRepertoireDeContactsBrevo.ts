import { Aidant } from '../espace-aidant/Aidant';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';
import {
  AdaptateursRequeteBrevo,
  adaptateursRequeteBrevo,
} from '../infrastructure/adaptateurs/adaptateursRequeteBrevo';
import { unConstructeurCreationDeContact } from '../infrastructure/brevo/ConstructeursBrevo';
import { DemandeAide } from '../gestion-demandes/aide/DemandeAide';

export class AdaptateurRepertoireDeContactsBrevo
  implements RepertoireDeContacts
{
  private brevo: AdaptateursRequeteBrevo;

  constructor() {
    this.brevo = adaptateursRequeteBrevo();
  }

  async creeAidant(aidant: Aidant): Promise<void> {
    await this.brevo
      .creationContact()
      .execute(
        unConstructeurCreationDeContact()
          .ayantPourEmail(aidant.email)
          .ayantPourAttributs({ MAC_PROFIL: 'AIDANT' })
          .construis()
      );
  }

  async creeAide(aide: DemandeAide): Promise<void> {
    await this.brevo
      .creationContact()
      .execute(
        unConstructeurCreationDeContact()
          .ayantPourEmail(aide.email)
          .ayantPourAttributs({ MAC_PROFIL: 'AIDE' })
          .construis()
      );
  }
}
