import crypto from 'crypto';

export interface AdaptateurRelations {
  aidantInitieDiagnostic(
    identifiantAidant: crypto.UUID,
    identifiantDiagnostic: crypto.UUID,
  ): Promise<void>;
}
