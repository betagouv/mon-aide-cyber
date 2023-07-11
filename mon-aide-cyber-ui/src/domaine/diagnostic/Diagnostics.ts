import { Entrepot } from "../Entrepots.ts";
import { Aggregat } from "../Aggregat.ts";
import { Diagnostic } from "./Diagnostic.ts";

export type Diagnostics = Aggregat &
  Omit<Aggregat, "identifiant"> &
  (Diagnostic &
    Omit<Diagnostic, "referentiel"> & {
      actions: { [key: string]: string }[];
    })[];

export interface EntrepotDiagnostics extends Entrepot<Diagnostics> {
  tous(): Promise<Diagnostics>;
}
