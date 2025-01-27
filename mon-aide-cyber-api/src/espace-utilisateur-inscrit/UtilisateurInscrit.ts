import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';

export type EntiteUtilisateurInscrit = {
  siret?: string;
};

export type UtilisateurInscrit = Aggregat & {
  email: string;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  entite?: EntiteUtilisateurInscrit;
};

export type EntrepotUtilisateurInscrit = Entrepot<UtilisateurInscrit>;
