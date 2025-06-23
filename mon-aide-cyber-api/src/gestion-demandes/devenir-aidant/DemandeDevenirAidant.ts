import { Aggregat } from '../../domaine/Aggregat';
import { EntrepotEcriture } from '../../domaine/Entrepot';
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
  entite: EntiteDemande;
};
export interface EntrepotDemandeDevenirAidant
  extends EntrepotEcriture<DemandeDevenirAidant> {
  demandeExiste(mail: string): Promise<boolean>;

  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined>;
}

export type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';

export type EntiteDemande = {
  type: TypeEntite;
  nom: string;
  siret: string;
};
export const futurAidantEnAttenteAdhesionAssociation = (
  demandeDevenirAidant: DemandeDevenirAidant
) =>
  demandeDevenirAidant.entite &&
  demandeDevenirAidant.entite.type === 'Association' &&
  (!demandeDevenirAidant.entite.nom ||
    demandeDevenirAidant.entite.nom.trim() === '') &&
  (!demandeDevenirAidant.entite.siret ||
    demandeDevenirAidant.entite.siret.trim() === '');
