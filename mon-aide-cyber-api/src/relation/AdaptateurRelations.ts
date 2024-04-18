import crypto from 'crypto';

export type Diagnostic = {
  identifiant: crypto.UUID;
};

export interface AdaptateurRelations {
  aidantInitieDiagnostic(
    identifiantAidant: crypto.UUID,
    identifiantDiagnostic: crypto.UUID,
  ): Promise<void>;

  diagnosticsInitiePar(identifiantAidant: crypto.UUID): Promise<string[]>;
}
