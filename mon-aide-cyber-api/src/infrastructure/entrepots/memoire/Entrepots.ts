import { Entrepots } from "../../../domaine/Entrepots";
import { EntrepotDiagnostique } from "../../../diagnostique/Diagnostique";

import { EntrepotDiagnostiqueMemoire } from "./EntrepotsMemoire";

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostique: EntrepotDiagnostique =
    new EntrepotDiagnostiqueMemoire();

  diagnostique(): EntrepotDiagnostique {
    return this.entrepotDiagnostique;
  }
}
