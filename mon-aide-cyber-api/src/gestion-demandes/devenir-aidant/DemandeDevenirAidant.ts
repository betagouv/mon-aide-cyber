import { Aggregat } from '../../domaine/Aggregat';
import { Entrepot } from '../../domaine/Entrepot';

export type DemandeDevenirAidant = Aggregat & {
  date: Date;
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
};
export interface EntrepotDemandeDevenirAidant
  extends Entrepot<DemandeDevenirAidant> {
  demandeExiste(mail: string): Promise<boolean>;
}
