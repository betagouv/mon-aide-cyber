import { Aggregat } from '../../domaine/Aggregat';
import { Entrepot } from '../../domaine/Entrepot';
import { Departement } from '../departements';

export enum StatutDemande {
  EN_COURS = 'EN_COURS',
  TRAITEE = 'TRAITEE',
}

export type DemandeDevenirAidant = Aggregat & {
  date: Date;
  nom: string;
  prenom: string;
  mail: string;
  departement: Departement;
  statut: StatutDemande;
};
export interface EntrepotDemandeDevenirAidant
  extends Entrepot<DemandeDevenirAidant> {
  demandeExiste(mail: string): Promise<boolean>;

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined>;
}
