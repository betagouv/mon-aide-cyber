import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import { Objet, Relation, Tuple, Utilisateur } from '../../src/relation/Tuple';

export class AdaptateurRelationsTest implements AdaptateurRelations {
  constructor(private readonly relations: Map<string, string[]>) {}

  creeTuple(_tuple: Tuple): Promise<void> {
    throw new Error('Method not implemented.');
  }

  creeTupleEntiteAideeBeneficieDiagnostic(
    __identifiantDiagnostic: crypto.UUID,
    __emailEntite: string
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  diagnosticDeLAide(__identifiantDiagnostic: crypto.UUID): Promise<Tuple> {
    throw new Error('Method not implemented.');
  }

  aidantInitieDiagnostic(_: crypto.UUID, __: crypto.UUID): Promise<void> {
    return Promise.resolve();
  }

  diagnosticsFaitsParUtilisateurMAC(
    identifiantAidant: crypto.UUID
  ): Promise<string[]> {
    return Promise.resolve(this.relations.get(identifiantAidant) || []);
  }

  relationExiste(
    _relation: Relation,
    utilisateur: Utilisateur,
    objet: Objet
  ): Promise<boolean> {
    return Promise.resolve(
      !!this.relations
        .get(utilisateur.identifiant)
        ?.filter((d) => d === objet.identifiant)
    );
  }

  retireLesRelations(
    _relations: { relation: string; utilisateur: Utilisateur; objet: Objet }[]
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async attribueDemandeAAidant(
    _identifiantDemande: crypto.UUID,
    _identifiantAidant: crypto.UUID
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  demandeDejaPourvue(_identifiantDemande: crypto.UUID): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
