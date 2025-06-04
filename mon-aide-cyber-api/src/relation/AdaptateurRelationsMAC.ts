import { Objet, Relation, Tuple, unTuple, Utilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations, Email } from './AdaptateurRelations';
import { EntrepotRelation } from './EntrepotRelation';
import { fabriqueEntrepotRelations } from './infrastructure/fabriqueEntrepotRelations';
import {
  DefinitionEntiteAideeBeneficieDiagnostic,
  definitionEntiteAideeBeneficieDiagnostic,
  unTupleAttributionDemandeAideAAidant,
} from '../diagnostic/tuples';
import { ServiceDeHashage } from '../securite/ServiceDeHashage';
import { adaptateurServiceDeHashage } from '../infrastructure/adaptateurs/adaptateurServiceDeHashage';

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  constructor(
    private readonly tupleEntrepot: EntrepotRelation = fabriqueEntrepotRelations(),
    private readonly serviceDeHash: ServiceDeHashage = adaptateurServiceDeHashage()
  ) {}

  async creeTupleEntiteAideeBeneficieDiagnostic(
    identifiantDiagnostic: crypto.UUID,
    emailEntiteAidee: string
  ): Promise<void> {
    const tuple = unTuple<DefinitionEntiteAideeBeneficieDiagnostic>(
      definitionEntiteAideeBeneficieDiagnostic
    )
      .avecUtilisateur(this.serviceDeHash.hashe(emailEntiteAidee))
      .avecObjet(identifiantDiagnostic)
      .construis();

    await this.creeTuple(tuple);
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
