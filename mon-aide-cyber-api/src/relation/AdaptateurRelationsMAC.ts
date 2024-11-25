import { Objet, Relation, Tuple, Utilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations } from './AdaptateurRelations';
import { EntrepotRelation } from './EntrepotRelation';
import { fabriqueEntrepotRelations } from './infrastructure/fabriqueEntrepotRelations';

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  private tupleEntrepot: EntrepotRelation;

  constructor(tupleEntrepot: EntrepotRelation = fabriqueEntrepotRelations()) {
    this.tupleEntrepot = tupleEntrepot;
  }

  async creeTuple(tuple: Tuple): Promise<void> {
    await this.tupleEntrepot.persiste(tuple);
  }

  identifiantsObjetsLiesAUtilisateur(
    identifiantUtilisateur: crypto.UUID
  ): Promise<string[]> {
    return this.tupleEntrepot
      .trouveObjetsLiesAUtilisateur(identifiantUtilisateur)
      .then((tuples) => tuples.map((tuple) => tuple.objet.identifiant));
  }

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return this.tupleEntrepot.relationExiste(relation, utilisateur, objet);
  }

  typeRelationExiste(relation: Relation, objet: Objet) {
    return this.tupleEntrepot.typeRelationExiste(relation, objet);
  }
}
