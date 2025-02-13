import { Aggregat } from '../../domaine/Aggregat';
import { Departement } from '../departements';
import { EntrepotEcriture, EntrepotLecture } from '../../domaine/Entrepot';

export type DemandeAide = Aggregat & {
  dateSignatureCGU: Date;
  email: string;
  raisonSociale?: string;
  departement: Departement;
};
export interface EntrepotDemandeAide extends EntrepotEcriture<DemandeAide> {
  rechercheParEmail(email: string): Promise<DemandeAide | undefined>;
}

export type DemandeAideSimple = Aggregat & {
  dateSignatureCGU: Date;
};
export type EntrepotDemandeAideLecture = EntrepotLecture<DemandeAideSimple>;
