import { Entrepots } from '../../../domaine/Entrepots';

import {
  EntrepotAidantMemoire,
  EntrepotAideMemoire,
  EntrepotDiagnosticMemoire,
  EntrepotRestitutionMemoire,
} from './EntrepotMemoire';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotAidant } from '../../../authentification/Aidant';
import { EntrepotRestitution } from '../../../restitution/Restitution';
import { EntrepotAide } from '../../../aide/Aide';

export class EntrepotsMemoire implements Entrepots {
  private entrepotDiagnostic: EntrepotDiagnostic =
    new EntrepotDiagnosticMemoire();
  private entrepotAidants: EntrepotAidant = new EntrepotAidantMemoire();
  private entrepotRestitution: EntrepotRestitution =
    new EntrepotRestitutionMemoire();
  private entrepotAides: EntrepotAide = new EntrepotAideMemoire();
  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants() {
    return this.entrepotAidants;
  }

  restitution(): EntrepotRestitution {
    return this.entrepotRestitution;
  }

  aides() {
    return this.entrepotAides;
  }
}
