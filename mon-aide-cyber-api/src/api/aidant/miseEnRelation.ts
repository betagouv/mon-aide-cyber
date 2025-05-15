import { Departement } from '../../gestion-demandes/departements';

export type DemandePourPostuler = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};
