import { Entrepot } from '../domaine/Entrepot';
import { Tuple } from './Tuple';
import crypto from 'crypto';

export interface EntrepotRelation extends Entrepot<Tuple> {
  trouveDiagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<Tuple[]>;
}
