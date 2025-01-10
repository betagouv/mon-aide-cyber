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
  entite?: EntiteDemande;
};
export interface EntrepotDemandeDevenirAidant
  extends Entrepot<DemandeDevenirAidant> {
  demandeExiste(mail: string): Promise<boolean>;

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined>;
}

export type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';

export type EntiteDemande = {
  type: TypeEntite;
  nom?: string;
  siret?: string;
};
