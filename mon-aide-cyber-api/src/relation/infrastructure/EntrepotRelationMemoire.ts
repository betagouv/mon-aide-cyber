import { Tuple } from '../Tuple';

import { Entrepot, EntrepotRelation } from '../EntrepotRelation';
import crypto from 'crypto';
import { Aggregat } from '../Aggregat';
import { cloneDeep } from 'lodash';

export class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  protected entites: Map<crypto.UUID, T> = new Map();

  async persiste(entite: T) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }
}

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
