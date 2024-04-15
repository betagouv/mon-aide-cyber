import { Tuple } from './Tuple';
import crypto from 'crypto';
import { Aggregat } from './Aggregat';

export interface Entrepot<T extends Aggregat> {
  persiste(entite: T): Promise<void>;

  typeAggregat(): string;
}

export interface EntrepotRelation extends Entrepot<Tuple> {
  trouveDiagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<Tuple[]>;
}
