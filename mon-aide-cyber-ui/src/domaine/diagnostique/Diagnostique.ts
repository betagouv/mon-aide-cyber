import { Referentiel } from "./Referentiel.ts";
import { Aggregat } from "../Aggregat.ts";

export type Diagnostique = Aggregat & {
  referentiel: Referentiel;
};
