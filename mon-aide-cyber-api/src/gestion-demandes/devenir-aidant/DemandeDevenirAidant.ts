import { Aggregat } from '../../domaine/Aggregat';
import { Entrepot } from '../../domaine/Entrepot';
import { Departement } from '../departements';

export type DemandeDevenirAidant = Aggregat & {
  date: Date;
  nom: string;
  prenom: string;
  mail: string;
  departement: Departement;
};
export interface EntrepotDemandeDevenirAidant
  extends Entrepot<DemandeDevenirAidant> {
  demandeExiste(mail: string): Promise<boolean>;

  rechercheParMail(mail: string): Promise<DemandeDevenirAidant | undefined>;
}
