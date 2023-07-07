import * as crypto from "crypto";
import { Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";

export type Diagnostique = {
  identifiant: crypto.UUID;
  referentiel: Referentiel;
};
export type EntrepotDiagnostique = Entrepot<Diagnostique>;
