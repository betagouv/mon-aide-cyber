import { ReponseHATEOAS } from '../../hateoas/hateoas';
import { TypeAffichageAnnuaire } from '../../../espace-aidant/Aidant';

export type Profil = ReponseHATEOAS & {
  nomPrenom: string;
  dateSignatureCGU: string;
  identifiantConnexion: string;
  consentementAnnuaire?: boolean;
  affichagesAnnuaire?: {
    type: TypeAffichageAnnuaire;
    valeur: string;
    actif?: boolean;
  }[];
};
