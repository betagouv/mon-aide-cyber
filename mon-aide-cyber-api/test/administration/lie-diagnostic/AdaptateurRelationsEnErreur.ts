import { AdaptateurRelations } from '../../../src/relation/AdaptateurRelations';
import crypto from 'crypto';
import { Objet, Relation, Utilisateur } from '../../../src/relation/Tuple';

export class AdaptateurRelationsEnErreur implements AdaptateurRelations {
  aidantInitieDiagnostic(_: crypto.UUID, __: crypto.UUID): Promise<void> {
    throw new Error('Erreur attendue');
  }

  diagnosticsInitiePar(_: crypto.UUID): Promise<string[]> {
    return Promise.resolve([]);
  }

  relationExiste(
    _relation: Relation,
    _utilisateur: Utilisateur,
    _objet: Objet,
  ): Promise<boolean> {
    return Promise.resolve(false);
  }
}
