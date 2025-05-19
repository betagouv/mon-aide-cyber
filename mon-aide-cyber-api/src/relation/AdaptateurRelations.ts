import crypto from 'crypto';
import { Objet, Relation, Tuple, Utilisateur } from './Tuple';

export type Email = string;

export type Diagnostic = {
  identifiant: crypto.UUID;
};

export interface AdaptateurRelations {
  creeTuple(tuple: Tuple): Promise<void>;

  diagnosticsFaitsParUtilisateurMAC(
    identifiantAidant: crypto.UUID
  ): Promise<string[]>;

  diagnosticsDeLAide(email: Email): Promise<string[]>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean>;

  retireLesRelations(
    relations: {
      relation: Relation;
      utilisateur: Utilisateur;
      objet: Objet;
    }[]
  ): Promise<void>;

  attribueDemandeAAidant(
    identifiantDemande: crypto.UUID,
    identifiantAidant: crypto.UUID
  ): Promise<void>;
}
