import { Entrepots } from '../../../domaine/Entrepots';

import {
  EntrepotAidantMemoire,
  EntrepotDiagnosticMemoire,
} from './EntrepotMemoire';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotAidant } from '../../../authentification/Aidant';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();
  private entrepotAidants: EntrepotAidant = new EntrepotAidantMemoire();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants() {
    return this.entrepotAidants;
  }
}
