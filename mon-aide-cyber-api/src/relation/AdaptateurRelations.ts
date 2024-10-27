import crypto from 'crypto';
import { Objet, Relation, Tuple, Utilisateur } from './Tuple';

export type Diagnostic = {
  identifiant: crypto.UUID;
};

export interface AdaptateurRelations {
  creeTuple(tuple: Tuple): Promise<void>;

  identifiantsObjetsLiesAUtilisateur(
    identifiantAidant: crypto.UUID
  ): Promise<string[]>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean>;
}
