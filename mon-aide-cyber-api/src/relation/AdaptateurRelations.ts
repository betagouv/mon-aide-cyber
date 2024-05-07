import crypto from 'crypto';
import { Objet, Relation, Utilisateur } from './Tuple';

export type Diagnostic = {
  identifiant: crypto.UUID;
};

export interface AdaptateurRelations {
  aidantInitieDiagnostic(
    identifiantAidant: crypto.UUID,
    identifiantDiagnostic: crypto.UUID,
  ): Promise<void>;

  diagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<string[]>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet,
  ): Promise<boolean>;
}
