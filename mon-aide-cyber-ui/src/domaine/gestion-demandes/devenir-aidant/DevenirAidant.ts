import { ReponseHATEOAS } from '../../Lien.ts';
import { Departement } from '../departement.ts';
import { TypeAidant } from '../parcours-aidant/reducteurEtapes.ts';

export type ReponseDemandeInitiee = ReponseHATEOAS & PreRequisDemande;
export type PreRequisDemande = {
  departements: Departement[];
};

export enum TypeServiceEntite {
  SERVICE_PUBLIC = 'ServicePublic',
  SERVICE_ETAT = 'ServiceEtat',
  ASSOCIATION = 'Association',
}
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

export const entiteEnFonctionDuTypeAidant = new Map<
  TypeAidant,
  (nom?: string, siret?: string) => Entite
>([
  [
    'RepresentantEtat',
    (nom, siret) => ({
      type: TypeServiceEntite.SERVICE_ETAT,
      nom,
      siret,
    }),
  ],
  [
    'AgentPublic',
    (nom, siret) => ({
      type: TypeServiceEntite.SERVICE_PUBLIC,
      nom,
      siret,
    }),
  ],
  [
    'Association',
    (nom, siret) => ({
      type: TypeServiceEntite.ASSOCIATION,
      nom,
      siret,
    }),
  ],
  [
    'FuturAdherent',
    () => ({
      type: TypeServiceEntite.ASSOCIATION,
    }),
  ],
]);
