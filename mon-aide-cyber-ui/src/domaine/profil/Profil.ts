import { ReponseHATEOAS } from '../Lien.ts';
import { TypeAffichageAnnuaire } from 'mon-aide-cyber-api/src/espace-aidant/Aidant.ts';

export type Profil = ReponseHATEOAS & {
  nomPrenom: string;
  dateSignatureCGU: string;
  identifiantConnexion: string;
  consentementAnnuaire: boolean;
  affichagesAnnuaire?: {
    type: TypeAffichageAnnuaire;
    valeur: string;
    actif?: boolean;
  }[];
};
