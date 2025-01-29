import { Aggregat } from '../domaine/Aggregat';
import { Entrepot } from '../domaine/Entrepot';
import crypto from 'crypto';

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

export interface ServiceUtilisateurInscrit {
  valideLesCGU(identifiantUtilisateur: crypto.UUID): Promise<void>;
  valideProfil(identifiantUtilisateurInscrit: crypto.UUID): Promise<void>;
}
