import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { TypeAidant } from '../parcours-aidant/reducteurEtapes.ts';
import { Entreprise } from '../parcours-aidant/ChoixTypeAidant.tsx';

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
  typeAidant?: TypeAidant;
  entreprise?: Entreprise;
};
