import { ReponseHATEOAS } from '../Lien.ts';

export type CorpsDemandeAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
};

export type Departement = { nom: string; code: string };

export type ReponseDemandeAide = ReponseHATEOAS & {
  departements: Departement[];
};
