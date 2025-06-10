import crypto from 'crypto';
import { Objet, Relation, Tuple, Utilisateur } from './Tuple';

export type Email = string;

export type Diagnostic = {
  identifiant: crypto.UUID;
};

export interface AdaptateurRelations {
  creeTuple(tuple: Tuple): Promise<void>;

  creeTupleEntiteAideeBeneficieDiagnostic(
    identifiantDiagnostic: crypto.UUID,
    emailEntiteAidee: string
  ): Promise<void>;

  diagnosticsFaitsParUtilisateurMAC(
    identifiantAidant: crypto.UUID
  ): Promise<string[]>;

  diagnosticDeLAide(identifiantDiagnostic: crypto.UUID): Promise<Tuple>;

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

  demandeDejaPourvue(identifiantDemande: crypto.UUID): Promise<boolean>;
}
