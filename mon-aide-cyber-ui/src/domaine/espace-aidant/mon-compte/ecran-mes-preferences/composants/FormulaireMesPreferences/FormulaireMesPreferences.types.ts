import { Departement } from '../../../../../gestion-demandes/departement';

export type PreferencesAidantOptionel = {
  typesEntites?: string[];
  secteursActivite?: string[];
  departements?: string[];
};

export type PreferencesAidant = {
  typesEntites: string[];
  secteursActivite: string[];
  departements: string[];
};

export type Preferences = {
  preferencesAidant: PreferencesAidantOptionel;
  referentiel: {
    typesEntites: { nom: string; libelle: string }[];
    secteursActivite: string[];
    departements: Departement[];
  };
};
