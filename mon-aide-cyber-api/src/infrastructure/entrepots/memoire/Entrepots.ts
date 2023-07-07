import { Entrepots } from "../../../domaine/Entrepots";

import { EntrepotDiagnosticMemoire } from "./EntrepotsMemoire";
import { EntrepotDiagnostic } from "../../../diagnostic/Diagnostic";

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }
}
