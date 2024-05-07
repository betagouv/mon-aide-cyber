import { Objet, Relation, Tuple, Utilisateur } from './Tuple';
import { Aggregat } from './Aggregat';

export interface Entrepot<T extends Aggregat> {
  persiste(entite: T): Promise<void>;

  typeAggregat(): string;
}

export interface EntrepotRelation extends Entrepot<Tuple> {
  trouveDiagnosticsInitiePar(identifiantAidant: string): Promise<Tuple[]>;

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet,
  ): Promise<boolean>;
}
