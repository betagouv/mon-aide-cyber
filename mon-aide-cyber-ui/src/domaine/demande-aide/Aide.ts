import { ReponseHATEOAS } from '../Lien';

export type CorpsDemandeAide = {
  cguValidees: boolean;
  email: string;
  departement: string;
  raisonSociale?: string;
  relationAidant: boolean;
};

export type Departement = { nom: string; code: string };

export type ReponseDemandeAide = ReponseHATEOAS & {
  departements: Departement[];
};
