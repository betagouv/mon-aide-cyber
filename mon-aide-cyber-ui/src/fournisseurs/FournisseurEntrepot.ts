import { createContext } from "react";
import { Diagnostique } from "../domaine/diagnostique/Diagnostique.ts";

export interface Entrepot<T> {
  lis(identifiant: string): Promise<T>;
}

export type EntrepotDiagnostique = Entrepot<Diagnostique>;

export interface Entrepots {
  diagnostique(): EntrepotDiagnostique;
}

export class APIEntrepotDiagnostique implements EntrepotDiagnostique {
  lis(_: string): Promise<Diagnostique> {
    return Promise.reject("Pas encore implémenté!");
  }
}

export const FournisseurEntrepots = createContext<Entrepots>({
  diagnostique: (): EntrepotDiagnostique => new APIEntrepotDiagnostique(),
});
