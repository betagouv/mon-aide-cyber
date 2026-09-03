import {
  Evenement,
  RepertoireDeContacts,
} from '../../contacts/RepertoireDeContacts';
import {
  AdaptateursRequeteBrevo,
  adaptateursRequeteBrevo,
} from './adaptateursRequeteBrevo';
import {
  unConstructeurCreationDeContact,
  unConstructeurEvenement,
  uneRequeteBrevoPut,
} from '../brevo/ConstructeursBrevo';

export class AdaptateurRepertoireDeContactsBrevo implements RepertoireDeContacts {
  private brevo: AdaptateursRequeteBrevo;

  constructor() {
    this.brevo = adaptateursRequeteBrevo();
  }

  async modifieEmail(ancienEmail: string, nouvelEmail: string): Promise<void> {
    await this.brevo
      .requetePostSurContacts(ancienEmail)
      .execute(
        uneRequeteBrevoPut({ attributes: { EMAIL: nouvelEmail } }).construis()
      );
  }

  private async creeContact(
    email: string,
    profil: 'AIDANT' | 'AIDE' | 'UTILISATEUR_INSCRIT',
    attributs?: Record<string, unknown>
  ) {
    await this.brevo.creationContact().execute(
      unConstructeurCreationDeContact()
        .ayantPourEmail(email)
        .ayantPourAttributs({ ...attributs, MAC_PROFIL: profil })
        .construis()
    );
  }

  async creeAidant(
    email: string,
    pixelDeSuiviAutorise: boolean
  ): Promise<void> {
    await this.creeContact(email, 'AIDANT', {
      _PIXEL_TRACKING_CONSENT: pixelDeSuiviAutorise,
    });
  }

  async creeAide(email: string): Promise<void> {
    await this.creeContact(email, 'AIDE');
  }

  async creeUtilisateurInscrit(
    email: string,
    pixelDeSuiviAutorise: boolean
  ): Promise<void> {
    await this.creeContact(email, 'UTILISATEUR_INSCRIT', {
      _PIXEL_TRACKING_CONSENT: pixelDeSuiviAutorise,
    });
  }

  async emetsEvenement(evenement: Evenement): Promise<void> {
    await this.brevo
      .creationEvenement()
      .execute(
        unConstructeurEvenement()
          .ayantPourMail(evenement.email)
          .ayantPourType(evenement.type)
          .construis()
      );
  }
}
