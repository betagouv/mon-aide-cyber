import { Departement } from '../gestion-demandes/departement.ts';
import { ReponseHATEOAS } from '../Lien.ts';

export type ReponsePreferencesAPI = ReponseHATEOAS & {
  preferencesAidant: {
    typesEntites: string[];
    departements: string[];
    secteursActivite: string[];
  };
  referentiel: {
    typesEntites: { nom: string; libelle: string }[];
    departements: Departement[];
    secteursActivite: string[];
  };
};
