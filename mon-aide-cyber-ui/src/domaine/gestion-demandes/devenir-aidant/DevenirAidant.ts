import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';

export type ReponseDemandeInitiee = ReponseHATEOAS & PreRequisDemande;
export type PreRequisDemande = {
  departements: Departement[];
};
export type CorpsDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
};
