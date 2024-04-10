import { EntrepotDiagnostic } from '../diagnostic/Diagnostic';
import { EntrepotAidant } from '../authentification/Aidant';
import { EntrepotRestitution } from '../restitution/Restitution';
import { EntrepotAide } from '../aide/Aide';

import { EntrepotRelation } from '../relation/EntrepotRelation';

export interface Entrepots {
  diagnostic(): EntrepotDiagnostic;
  aidants(): EntrepotAidant;
  restitution(): EntrepotRestitution;
  aides(): EntrepotAide;
  relation(): EntrepotRelation;
}
