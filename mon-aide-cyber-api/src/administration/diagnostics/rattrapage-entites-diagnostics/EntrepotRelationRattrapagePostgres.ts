import { EntrepotRelation } from '../../../relation/EntrepotRelation';
import crypto from 'crypto';
import { Tuple } from '../../../relation/Tuple';
import {
  EntrepotRelationPostgres,
  TupleDTO,
} from '../../../relation/infrastructure/EntrepotRelationPostgres';
import { AggregatNonTrouve } from '../../../relation/Aggregat';

export interface EntrepotRelationRattrapage extends EntrepotRelation {
  parIdentifiant(id: crypto.UUID): Promise<Tuple>;
}

export class EntrepotRelationRattrapagePostgres
  extends EntrepotRelationPostgres
  implements EntrepotRelationRattrapage
{
  protected champsAMettreAJour(tupleDTO: TupleDTO): Partial<TupleDTO> {
    return { donnees: tupleDTO.donnees };
  }

  async parIdentifiant(id: crypto.UUID): Promise<Tuple> {
    return this.knex
      .from(this.nomTable())
      .whereRaw('id = ?', id)
      .first()
      .then((ligne: TupleDTO) => {
        if (!ligne) {
          return Promise.reject(new AggregatNonTrouve('relation'));
        }
        return this.deDTOAEntite(ligne);
      });
  }
}
