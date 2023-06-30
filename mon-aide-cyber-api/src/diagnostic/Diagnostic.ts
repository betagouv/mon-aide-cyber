import * as crypto from "crypto";
import { Referentiel } from "./Referentiel";

export type Diagnostic = {
  identifiant: crypto.UUID;
  referentiel: Referentiel;
};
