import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

export type Diagnostic = Aggregat & {
  referentiel: Referentiel;
};
