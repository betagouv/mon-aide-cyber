import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

import { Entrepot, Lien } from "../Entrepots.ts";

export type Diagnostique = Aggregat & {
  referentiel: Referentiel;
};
export interface EntrepotDiagnostique extends Entrepot<Diagnostique> {
  lancer(): Promise<Lien>;
}
