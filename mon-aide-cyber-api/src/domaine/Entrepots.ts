import { EntrepotDiagnostique } from "../diagnostique/Diagnostique";

export interface Entrepots {
  diagnostique(): EntrepotDiagnostique;
}
