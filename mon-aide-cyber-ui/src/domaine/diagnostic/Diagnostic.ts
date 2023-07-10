import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot, Lien } from "../Entrepots.ts";

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
export interface EntrepotDiagnostic extends Entrepot<Diagnostic> {
  lancer(): Promise<Lien>;
}
