import { Aggregat } from '../../domaine/Aggregat';
import { Departement } from '../departements';
import { EntrepotLecture } from '../../domaine/Entrepot';

export type DemandeAide = Aggregat & {
  dateSignatureCGU: Date;
  email: string;
  raisonSociale?: string;
  departement: Departement;
  siret: string | 'NON_DISPONIBLE';
};

export type RechercheDemandeAide =
  | RechercheDemandeAideComplete
  | RechercheDemandeAideNonTrouvee;
export type RechercheDemandeAideComplete = {
  demandeAide: DemandeAide;
  etat: 'COMPLET';
};
export type RechercheDemandeAideNonTrouvee = {
  etat: 'INEXISTANT' | 'INCOMPLET';
};

export interface EntrepotDemandeAide {
  rechercheParEmail(email: string): Promise<RechercheDemandeAide>;
  persiste(entite: DemandeAide): Promise<void>;
}

export type DemandeAideSimple = Aggregat & {
  dateSignatureCGU: Date;
};
export type EntrepotDemandeAideLecture = EntrepotLecture<DemandeAideSimple>;
