import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot } from "../Entrepots.ts";
import { LienRoutage } from "../LienRoutage.ts";

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
export interface EntrepotDiagnostic extends Entrepot<Diagnostic> {
  lancer(): Promise<LienRoutage>;
}
