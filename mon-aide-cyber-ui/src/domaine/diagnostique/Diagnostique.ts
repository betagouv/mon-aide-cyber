import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot } from "../Entrepots.ts";

export type Diagnostique = Aggregat & {
  referentiel: Referentiel;
};
export type EntrepotDiagnostique = Entrepot<Diagnostique>;
