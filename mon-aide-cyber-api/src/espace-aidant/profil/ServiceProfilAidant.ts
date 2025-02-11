import crypto from 'crypto';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import {
  EntrepotAidant,
  formatteLeNomPrenomSelonRegleAffichage,
  TypeAffichageAnnuaire,
} from '../Aidant';

export type ProfilAidantModifie = Evenement<{
  identifiant: crypto.UUID;
  profil: {
    consentementAnnuaire: boolean;
  };
}>;

export class ServiceProfilAidant {
  constructor(
    private readonly entrepotAidant: EntrepotAidant,
    private readonly busEvenement: BusEvenement
  ) {}

  modifie(
    identifiantAidant: crypto.UUID,
    modificationProfil: {
      consentementAnnuaire: boolean;
      typeAffichageChoisi?: TypeAffichageAnnuaire;
    }
  ): Promise<void> {
    return this.entrepotAidant.lis(identifiantAidant).then((aidant) => {
      aidant.consentementAnnuaire = modificationProfil.consentementAnnuaire;
      if (modificationProfil.typeAffichageChoisi) {
        aidant.preferences.nomAffichageAnnuaire =
          formatteLeNomPrenomSelonRegleAffichage(
            aidant.nomPrenom,
            modificationProfil.typeAffichageChoisi
          );
      }
      return this.entrepotAidant.persiste(aidant).then(() =>
        this.busEvenement.publie<ProfilAidantModifie>({
          identifiant: aidant.identifiant,
          type: 'PROFIL_AIDANT_MODIFIE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiant: aidant.identifiant,
            profil: {
              consentementAnnuaire: aidant.consentementAnnuaire,
            },
          },
        })
      );
    });
  }
}
