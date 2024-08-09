import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';

export type CorpsDemandeAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type ReponseDemandeAide = ReponseHATEOAS & {
  departements: Departement[];
};
