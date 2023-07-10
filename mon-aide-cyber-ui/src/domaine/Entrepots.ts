import { EntrepotDiagnostique } from "./diagnostique/Diagnostique.ts";
import { Aggregat } from "./Aggregat.ts";

export type FormatLien = `/api/${string}`;
export class Lien {
  constructor(private readonly lien: FormatLien) {}

  route(): string {
    return this.lien.slice(this.lien.indexOf("/api") + 4);
  }
}

export interface Entrepot<T extends Aggregat> {
  lis(identifiant: string): Promise<T>;
}

export interface Entrepots {
  diagnostique(): EntrepotDiagnostique;
}
