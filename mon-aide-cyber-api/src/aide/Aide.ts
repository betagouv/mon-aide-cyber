import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';

export type Aide = Aggregat & {
  dateSignatureCGU: Date;
  email: string;
  raisonSociale?: string;
  departement: string;
};
export interface EntrepotAide extends Entrepot<Aide> {
  rechercheParEmail(email: string): Promise<Aide | undefined>;
}
