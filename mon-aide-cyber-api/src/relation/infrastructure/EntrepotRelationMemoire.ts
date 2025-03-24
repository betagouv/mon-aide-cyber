import { Objet, Relation, Tuple, Utilisateur } from '../Tuple';

import { Entrepot, EntrepotRelation, Relations } from '../EntrepotRelation';
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
  supprimeLesRelations(relations: Relations): Promise<void> {
    const relationsASupprimer = Array.from(this.entites.values()).filter(
      (tuple) => {
        return (
          relations.filter(
            (r) =>
              r.relation === tuple.relation &&
              r.objet.identifiant === tuple.objet.identifiant &&
              r.objet.type === tuple.objet.type &&
              r.utilisateur.identifiant === tuple.utilisateur.identifiant &&
              r.utilisateur.type === tuple.utilisateur.type
          ).length > 0
        );
      }
    );

    relationsASupprimer.forEach((r) => {
      this.entites.delete(r.identifiant);
    });

    return Promise.resolve();
  }
  trouveObjetsLiesAUtilisateur(
    identifiantUtilisateur: string
  ): Promise<Tuple[]> {
    const tuples = Array.from(this.entites.values()).filter(
      (tuple) => tuple.utilisateur.identifiant === identifiantUtilisateur
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

  typeRelationExiste(relation: string, objet: Objet): Promise<boolean> {
    return Promise.resolve(
      Array.from(this.entites.values()).filter((tuple) => {
        const obj = isEqual(tuple.objet, objet);
        return tuple.relation === relation && obj;
      }).length > 0
    );
  }
}
