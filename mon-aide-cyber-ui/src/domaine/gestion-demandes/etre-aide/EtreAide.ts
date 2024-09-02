import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';

export type CorpsDemandeEtreAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type ReponseDemandeEtreAide = ReponseHATEOAS & {
  departements: Departement[];
};
