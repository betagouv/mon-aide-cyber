import * as crypto from "crypto";
import { Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";

export type Diagnostic = {
  identifiant: crypto.UUID;
  referentiel: Referentiel;
};
export type EntrepotDiagnostic = Entrepot<Diagnostic>;
