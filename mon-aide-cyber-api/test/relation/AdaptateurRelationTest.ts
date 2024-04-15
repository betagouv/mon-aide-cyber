import { AdaptateurRelations } from '../../src/relation/AdaptateurRelations';
import crypto from 'crypto';

export class AdaptateurRelationsTest implements AdaptateurRelations {
  constructor(private readonly relations: Map<string, string[]>) {}

  aidantInitieDiagnostic(_: crypto.UUID, __: crypto.UUID): Promise<void> {
    return Promise.resolve();
  }

  diagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<string[]> {
    return Promise.resolve(this.relations.get(identifiantAidant) || []);
  }
}
