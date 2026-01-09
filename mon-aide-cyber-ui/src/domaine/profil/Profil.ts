import { ReponseHATEOAS } from '../Lien.ts';

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
export enum TypeAffichageAnnuaire {
  PRENOM_NOM = 'PRENOM_NOM',
  PRENOM_N = 'PRENOM_N',
  P_NOM = 'P_NOM',
}
