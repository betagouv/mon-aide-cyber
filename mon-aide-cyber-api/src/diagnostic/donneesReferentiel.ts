import { Referentiel } from './Referentiel';
import { donneesContexte } from './referentiel/donneesContexte';
import { donneesGouvernance } from './referentiel/donneesGouvernance';
import { donneesSecuriteAcces } from './referentiel/donneesSecuriteAcces';
import { donneesSecuritePoste } from './referentiel/donneesSecuritePoste';
import { donneesSensibilisation } from './referentiel/donneesSensibilisation';
import { donneesReaction } from './referentiel/donneesReaction';

const referentiel: Referentiel = {
  contexte: donneesContexte,
  gouvernance: donneesGouvernance,
  SecuriteAcces: donneesSecuriteAcces,
  securiteposte: donneesSecuritePoste,
  sensibilisation: donneesSensibilisation,
  reaction: donneesReaction,
};

export { referentiel };
