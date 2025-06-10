import { Objet, Relation, Tuple, unTuple, Utilisateur } from './Tuple';
import crypto from 'crypto';
import { AdaptateurRelations } from './AdaptateurRelations';
import { EntrepotRelation } from './EntrepotRelation';
import { fabriqueEntrepotRelations } from './infrastructure/fabriqueEntrepotRelations';
import {
  DefinitionEntiteAideeBeneficieDiagnostic,
  definitionEntiteAideeBeneficieDiagnostic,
  unTupleAttributionDemandeAideAAidant,
} from '../diagnostic/tuples';
import { ServiceDeChiffrement } from '../securite/ServiceDeChiffrement';
import { adaptateurServiceChiffrement } from '../infrastructure/adaptateurs/adaptateurServiceChiffrement';

export class AdaptateurRelationsMAC implements AdaptateurRelations {
  constructor(
    private readonly entrepotRelation: EntrepotRelation = fabriqueEntrepotRelations(),
    private readonly serviceDeChiffrement: ServiceDeChiffrement = adaptateurServiceChiffrement()
  ) {}

  async creeTupleEntiteAideeBeneficieDiagnostic(
    identifiantDiagnostic: crypto.UUID,
    emailEntiteAidee: string
  ): Promise<void> {
    const tuple = unTuple<DefinitionEntiteAideeBeneficieDiagnostic>(
      definitionEntiteAideeBeneficieDiagnostic
    )
      .avecUtilisateur(this.serviceDeChiffrement.chiffre(emailEntiteAidee))
      .avecObjet(identifiantDiagnostic)
      .construis();

    await this.creeTuple(tuple);
  }

  async creeTuple(tuple: Tuple): Promise<void> {
    await this.entrepotRelation.persiste(tuple);
  }

  async diagnosticsFaitsParUtilisateurMAC(
    identifiantUtilisateur: crypto.UUID
  ): Promise<string[]> {
    return this.entrepotRelation
      .trouveObjetsLiesAUtilisateur(identifiantUtilisateur)
      .then((tuples) => tuples.map((tuple) => tuple.objet.identifiant));
  }

  async diagnosticDeLAide(identifiantDiagnostic: crypto.UUID): Promise<Tuple> {
    const relationsDiagnostics =
      await this.entrepotRelation.trouveLesRelationsPourCetObjet(
        'destinataire',
        {
          identifiant: identifiantDiagnostic,
          type: 'diagnostic',
        }
      );
    const relationDiagnostic = relationsDiagnostics.find(
      (tuple) => tuple.utilisateur.type === 'entiteAidee'
    );
    if (relationDiagnostic) {
      return {
        ...relationDiagnostic,
        utilisateur: {
          type: relationDiagnostic.utilisateur.type,
          identifiant: this.serviceDeChiffrement.dechiffre(
            relationDiagnostic.utilisateur.identifiant
          ),
        },
      };
    }
    throw new Error();
  }

  relationExiste(
    relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return this.entrepotRelation.relationExiste(relation, utilisateur, objet);
  }

  retireLesRelations(
    relations: { relation: string; utilisateur: Utilisateur; objet: Objet }[]
  ): Promise<void> {
    return this.entrepotRelation.supprimeLesRelations(relations);
  }

  typeRelationExiste(relation: Relation, objet: Objet) {
    return this.entrepotRelation.typeRelationExiste(relation, objet);
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
