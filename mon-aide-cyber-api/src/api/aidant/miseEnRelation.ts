import { Departement } from '../../gestion-demandes/departements';

export type DemandePourPostuler = {
  dateCreation: string;
  departement: Departement;
  epci?: string;
  typeEntite: string;
  secteurActivite: string;
};
