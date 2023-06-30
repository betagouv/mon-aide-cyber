import { createContext } from "react";
import { Diagnostic } from "../domaine/diagnostic/Diagnostic.ts";

export interface Entrepot<T> {
  lis(identifiant: string): Promise<T>;
}

export type EntrepotDiagnostic = Entrepot<Diagnostic>;

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;
}

export class APIEntrepotDiagnostic implements EntrepotDiagnostic {
  lis(_: string): Promise<Diagnostic> {
    return Promise.reject("Pas encore implémenté!");
  }
}

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostic: (): EntrepotDiagnostic => new APIEntrepotDiagnostic(),
});
