import { Objet, Relation, Tuple, Utilisateur } from '../Tuple';

import { Entrepot, EntrepotRelation, Relations } from '../EntrepotRelation';
import crypto from 'crypto';
import { Aggregat } from '../Aggregat';
import { cloneDeep, isEqual } from 'lodash';
import * as util from 'node:util';

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
  typeAggregat(): string {
    return 'relation';
  }

  async parIdentifiant(id: crypto.UUID): Promise<Tuple> {
    const entite = this.entites.get(id);
    if (!entite) {
      throw new Error('Tuple non trouvé');
    }
    return entite;
  }

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

  async trouveObjetsLiesAUtilisateur(
    identifiantUtilisateur: string
  ): Promise<Tuple[]> {
    const tuples = Array.from(this.entites.values()).filter(
      (tuple) => tuple.utilisateur.identifiant === identifiantUtilisateur
    );

    return tuples;
  }

  async trouveLesRelationsPourCetObjet(
    relation: Relation,
    objet: Objet
  ): Promise<Tuple[]> {
    return Array.from(this.entites.values()).filter(
      (tuple) =>
        util.isDeepStrictEqual(tuple.objet, objet) &&
        tuple.relation === relation
    );
  }

  async relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return (
      Array.from(this.entites.values()).filter((tuple) => {
        const user = isEqual(tuple.utilisateur, utilisateur);
        const obj = isEqual(tuple.objet, objet);
        return user && tuple.relation === relation && obj;
      }).length > 0
    );
  }

  async typeRelationExiste(relation: string, objet: Objet): Promise<boolean> {
    return (
      Array.from(this.entites.values()).filter((tuple) => {
        const obj = isEqual(tuple.objet, objet);
        return tuple.relation === relation && obj;
      }).length > 0
    );
  }

  async toutesLesEntites(): Promise<Tuple[]> {
    return Array.from(this.entites.values());
  }
}
