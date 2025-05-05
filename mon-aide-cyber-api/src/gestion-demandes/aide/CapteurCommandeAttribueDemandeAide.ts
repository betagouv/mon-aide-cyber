import { CapteurCommande, Commande } from '../../domaine/commande';
import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { DemandeAide } from './DemandeAide';
import { gironde } from '../departements';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { Aidant } from '../../espace-aidant/Aidant';

export type CommandeAttribueDemandeAide = Omit<Commande, 'type'> & {
  type: 'CommandeAttribueDemandeAide';
};

export class CapteurCommandeAttribueDemandeAide
  implements CapteurCommande<CommandeAttribueDemandeAide, void>
{
  constructor(private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail) {}

  async execute(_commande: CommandeAttribueDemandeAide): Promise<void> {
    const demandeAide: DemandeAide = {
      email: 'entite-aidee@yopmail.com',
      raisonSociale: 'BETAGOUV',
      departement: gironde,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      identifiant: crypto.randomUUID(),
    };

    const aidant: Aidant = {
      consentementAnnuaire: false,
      email: 'user-xavier@yopmail.com',
      nomPrenom: 'User XAVIER',
      preferences: {
        secteursActivite: [],
        departements: [],
        typesEntites: [],
        nomAffichageAnnuaire: 'User X.',
      },
      identifiant: crypto.randomUUID(),
    };

    await this.adaptateurEnvoiMail.envoieConfirmationDemandeAideAttribuee({
      emailAidant: aidant.email,
      nomPrenomAidant: aidant.nomPrenom,
      departement: demandeAide.departement,
      emailEntite: demandeAide.email,
    });

    return Promise.resolve(undefined);
  }
}
