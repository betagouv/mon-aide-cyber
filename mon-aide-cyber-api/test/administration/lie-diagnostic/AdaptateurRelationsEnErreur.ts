import {
  AdaptateurRelations,
  Email,
} from '../../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import {
  Objet,
  Relation,
  Tuple,
  Utilisateur,
} from '../../../src/relation/Tuple';

export class AdaptateurRelationsEnErreur implements AdaptateurRelations {
  creeTuple(_tuple: Tuple): Promise<void> {
    throw new Error('Method not implemented.');
  }
  aidantInitieDiagnostic(_: crypto.UUID, __: crypto.UUID): Promise<void> {
    throw new Error('Erreur attendue');
  }
  diagnosticsFaitsParUtilisateurMAC(_: crypto.UUID): Promise<string[]> {
    return Promise.resolve([]);
  }
  diagnosticsDeLAide(_email: Email): Promise<string[]> {
    return Promise.resolve([]);
  }
  relationExiste(
    _relation: Relation,
    _utilisateur: Utilisateur,
    _objet: Objet
  ): Promise<boolean> {
    return Promise.resolve(false);
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
