import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot } from "../Entrepots.ts";
import { LienRoutage } from "../LienRoutage.ts";

export type Diagnostique = Aggregat & {
  referentiel: Referentiel;
};
export interface EntrepotDiagnostique extends Entrepot<Diagnostique> {
  lancer(): Promise<LienRoutage>;
}
