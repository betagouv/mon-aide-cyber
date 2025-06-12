import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { TypeAidant } from '../parcours-aidant/reducteurEtapes.ts';

export type ReponseDemandeInitiee = ReponseHATEOAS & PreRequisDemande;
export type DonneesUtilisateur = { nom: string; prenom: string; email: string };
export type PreRequisDemande = {
  departements: Departement[];
  donneesUtilisateur?: DonneesUtilisateur;
};

export type Entite = {
  type: 'ServicePublic' | 'ServiceEtat' | 'Association';
  nom?: string;
  siret?: string;
};

export type CorpsDemandeDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
  signatureCharte?: boolean;
  entite?: Entite;
};

export type CorpsValidationProfilAidant = {
  cguValidees: boolean;
  signatureCharte?: boolean;
  entite?: Entite;
};

export const entiteEnFonctionDuTypeAidant = new Map<
  TypeAidant,
  (nom?: string, siret?: string) => Entite
>([
  [
    'RepresentantEtat',
    (nom, siret) => ({
      type: 'ServiceEtat',
      nom,
      siret,
    }),
  ],
  [
    'AgentPublic',
    (nom, siret) => ({
      type: 'ServicePublic',
      nom,
      siret,
    }),
  ],
  [
    'Association',
    (nom, siret) => ({
      type: 'Association',
      nom,
      siret,
    }),
  ],
  [
    'FuturAdherent',
    () => ({
      type: 'Association',
    }),
  ],
]);
