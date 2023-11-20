import { EntrepotDiagnostic } from './diagnostic/Diagnostic.ts';
import { Aggregat } from './Aggregat.ts';
import { EntrepotDiagnostics } from './diagnostic/Diagnostics.ts';
import { EntrepotAuthentification } from './authentification/Authentification.ts';

export interface Entrepot<T extends Aggregat> {
  lis(identifiant: string): Promise<T>;
}

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;

  diagnostics(): EntrepotDiagnostics;

  authentification(): EntrepotAuthentification;
}
