import { EntrepotDiagnostic } from '../diagnostic/Diagnostic';
import { EntrepotAidant } from '../authentification/Aidant';

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;
  aidants(): EntrepotAidant;
}
