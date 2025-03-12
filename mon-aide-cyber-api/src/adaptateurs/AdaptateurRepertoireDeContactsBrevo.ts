import { Aidant } from '../espace-aidant/Aidant';
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
}
