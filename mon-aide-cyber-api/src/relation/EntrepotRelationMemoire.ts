import { EntrepotMemoire } from '../infrastructure/entrepots/memoire/EntrepotMemoire';
import { Tuple } from './Tuple';

import { EntrepotRelation } from './EntrepotRelation';
import crypto from 'crypto';

export class EntrepotRelationMemoire
  extends EntrepotMemoire<Tuple>
  implements EntrepotRelation
{
  trouveDiagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<Tuple[]> {
    const tuples = Array.from(this.entites.values()).filter(
      (tuple) =>
        tuple.utilisateur.identifiant === identifiantAidant &&
        tuple.utilisateur.type === 'aidant' &&
        tuple.relation === 'initiateur' &&
        tuple.objet.type === 'diagnostic',
    );

    return Promise.resolve(tuples);
  }
  typeAggregat(): string {
    return 'relation';
  }
}
