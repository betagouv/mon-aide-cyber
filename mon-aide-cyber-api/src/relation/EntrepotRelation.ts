import { Objet, Relation, Tuple, Utilisateur } from './Tuple';
import { Aggregat } from './Aggregat';

export interface Entrepot<T extends Aggregat> {
  persiste(entite: T): Promise<void>;

  typeAggregat(): string;
}

export type Relations = {
  relation: string;
  utilisateur: Utilisateur;
  objet: Objet;
}[];

export interface EntrepotRelation extends Entrepot<Tuple> {
  trouveObjetsLiesAUtilisateur(identifiantAidant: string): Promise<Tuple[]>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean>;

  typeRelationExiste(relation: Relation, objet: Objet): Promise<boolean>;

  supprimeLesRelations(relations: Relations): Promise<void>;
}
