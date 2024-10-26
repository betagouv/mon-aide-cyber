import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { AidantAnnuaire } from '../../vitrine/ecran-annuaire/AidantAnnuaire.ts';

export type CorpsDemandeEtreAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type CorpsDemandeSolliciterAidant = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  aidant?: AidantAnnuaire;
};

export type ReponseDemandeEtreAide = ReponseHATEOAS & {
  departements: Departement[];
};
