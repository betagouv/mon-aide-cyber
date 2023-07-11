import { Entrepot } from "../Entrepots.ts";
import { Diagnostique } from "./Diagnostique.ts";
import { Aggregat } from "../Aggregat.ts";

export type Diagnostics = Aggregat &
  Omit<Aggregat, "identifiant"> &
  (Diagnostique &
    Omit<Diagnostique, "referentiel"> & {
      actions: { [key: string]: string }[];
    })[];

export interface EntrepotDiagnostics extends Entrepot<Diagnostics> {
  tous(): Promise<Diagnostics>;
}
