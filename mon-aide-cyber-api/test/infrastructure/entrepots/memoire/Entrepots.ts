import { Entrepots } from '../../../../src/domaine/Entrepots';

import { EntrepotDiagnosticMemoire } from './EntrepotsMemoire';
import { EntrepotDiagnostic } from '../../../../src/diagnostic/Diagnostic';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }
}
