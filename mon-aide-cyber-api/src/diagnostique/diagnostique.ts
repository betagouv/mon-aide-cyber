import * as crypto from "crypto";
import { Referentiel } from "./referentiel";

export type Diagnostique = {
  identifiant: crypto.UUID;
  referentiel: Referentiel;
};
