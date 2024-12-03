import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { Departement } from '../gestion-demandes/departements';

export type Aide = Aggregat & {
  dateSignatureCGU: Date;
  email: string;
  raisonSociale?: string;
  departement: Departement;
};
export interface EntrepotAide extends Entrepot<Aide> {
  rechercheParEmail(email: string): Promise<Aide | undefined>;
}
