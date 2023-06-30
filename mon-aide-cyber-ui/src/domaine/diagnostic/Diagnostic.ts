import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot } from "../Entrepots.ts";

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
export type EntrepotDiagnostic = Entrepot<Diagnostic>;
