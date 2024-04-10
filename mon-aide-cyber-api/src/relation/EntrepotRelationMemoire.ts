import { EntrepotMemoire } from '../infrastructure/entrepots/memoire/EntrepotMemoire';
import { Tuple } from './Tuple';

import { EntrepotRelation } from './EntrepotRelation';

export class EntrepotRelationMemoire
  extends EntrepotMemoire<Tuple>
  implements EntrepotRelation
{
  typeAggregat(): string {
    return 'relation';
  }
}
