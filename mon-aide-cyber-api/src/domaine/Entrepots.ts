import { EntrepotDiagnostic } from '../diagnostic/Diagnostic';
import { EntrepotAidant } from '../authentification/Aidant';
import { EntrepotRestitution } from '../restitution/Restitution';

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;
  aidants(): EntrepotAidant;
  restitution(): EntrepotRestitution;
}
