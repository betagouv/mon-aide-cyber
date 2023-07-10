import { EntrepotDiagnostique } from "./diagnostique/Diagnostique.ts";
import { Aggregat } from "./Aggregat.ts";

export interface Entrepot<T extends Aggregat> {
  lis(identifiant: string): Promise<T>;
}

export interface Entrepots {
  diagnostique(): EntrepotDiagnostique;
}
