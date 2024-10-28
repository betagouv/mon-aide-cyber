import { Objet, Relation, Tuple, Utilisateur } from '../Tuple';

import { Entrepot, EntrepotRelation } from '../EntrepotRelation';
import crypto from 'crypto';
import { Aggregat } from '../Aggregat';
import { cloneDeep, isEqual } from 'lodash';

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
  trouveObjetsLiesAUtilisateur(identifiantAidant: string): Promise<Tuple[]> {
    const tuples = Array.from(this.entites.values()).filter(
      (tuple) =>
        tuple.utilisateur.identifiant === identifiantAidant &&
        tuple.utilisateur.type === 'aidant' &&
        tuple.relation === 'initiateur' &&
        tuple.objet.type === 'diagnostic'
    );

    return Promise.resolve(tuples);
  }

  typeAggregat(): string {
    return 'relation';
  }

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return Promise.resolve(
      Array.from(this.entites.values()).filter((tuple) => {
        const user = isEqual(tuple.utilisateur, utilisateur);
        const obj = isEqual(tuple.objet, objet);
        return user && tuple.relation === relation && obj;
      }).length > 0
    );
  }
}
