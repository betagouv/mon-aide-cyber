import { Aggregat } from '../../domaine/Aggregat';
import { Departement } from '../departements';
import { EntrepotLecture } from '../../domaine/Entrepot';

export type DemandeAide = Aggregat & {
  dateSignatureCGU: Date;
  email: string;
  raisonSociale?: string;
  departement: Departement;
};

export type RechercheDemandeAide = {
  demandeAide?: DemandeAide;
  etat: 'COMPLET' | 'INCOMPLET' | 'INEXISTANT';
};
export interface EntrepotDemandeAide {
  rechercheParEmail(email: string): Promise<RechercheDemandeAide>;
  persiste(entite: DemandeAide, miseAjour?: boolean): Promise<void>;
}

export type DemandeAideSimple = Aggregat & {
  dateSignatureCGU: Date;
};
export type EntrepotDemandeAideLecture = EntrepotLecture<DemandeAideSimple>;
