import { EntrepotDiagnostic } from "./diagnostic/Diagnostic.ts";

export interface Entrepot<T> {
  lis(identifiant: string): Promise<T>;
}

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;
}
