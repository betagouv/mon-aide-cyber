import { EntrepotDiagnostique } from "./diagnostique/Diagnostique.ts";

export interface Entrepot<T> {
  lis(identifiant: string): Promise<T>;
}

export interface Entrepots {
  diagnostique(): EntrepotDiagnostique;
}
