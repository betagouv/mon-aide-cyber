import { Objet, Relation, Tuple, Utilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations, Email } from './AdaptateurRelations';
import { EntrepotRelation } from './EntrepotRelation';
import { fabriqueEntrepotRelations } from './infrastructure/fabriqueEntrepotRelations';
import { unTupleAttributionDemandeAideAAidant } from '../diagnostic/tuples';

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  private tupleEntrepot: EntrepotRelation;

  constructor(tupleEntrepot: EntrepotRelation = fabriqueEntrepotRelations()) {
    this.tupleEntrepot = tupleEntrepot;
  }

  async creeTuple(tuple: Tuple): Promise<void> {
    await this.tupleEntrepot.persiste(tuple);
  }

  diagnosticsFaitsParUtilisateurMAC(
    identifiantUtilisateur: crypto.UUID
  ): Promise<string[]> {
    return this.tupleEntrepot
      .trouveObjetsLiesAUtilisateur(identifiantUtilisateur)
      .then((tuples) => tuples.map((tuple) => tuple.objet.identifiant));
  }

  diagnosticsDeLAide(email: Email): Promise<string[]> {
    return this.tupleEntrepot
      .trouveObjetsLiesAUtilisateur(email)
      .then((tuples) => tuples.map((tuple) => tuple.objet.identifiant));
  }

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return this.tupleEntrepot.relationExiste(relation, utilisateur, objet);
  }

  retireLesRelations(
    relations: { relation: string; utilisateur: Utilisateur; objet: Objet }[]
  ): Promise<void> {
    return this.tupleEntrepot.supprimeLesRelations(relations);
  }

  typeRelationExiste(relation: Relation, objet: Objet) {
    return this.tupleEntrepot.typeRelationExiste(relation, objet);
  }

  async attribueDemandeAAidant(
    identifiantDemande: crypto.UUID,
    identifiantAidant: crypto.UUID
  ): Promise<void> {
    await this.creeTuple(
      unTupleAttributionDemandeAideAAidant(
        identifiantDemande,
        identifiantAidant
      )
    );
  }

  async demandeDejaPourvue(identifiantDemande: crypto.UUID): Promise<boolean> {
    return this.typeRelationExiste('demandeAttribuee', {
      type: 'demandeAide',
      identifiant: identifiantDemande,
    });
  }
}
