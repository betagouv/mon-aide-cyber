import {
  Contexte,
  ServiceDiagnostic,
} from '../../src/diagnostic/ServiceDiagnostic';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { UUID } from 'crypto';
import { unContexteVide } from './ConstructeurContexte';

export class ServiceDiagnosticDeTest extends ServiceDiagnostic {
  constructor(private readonly diagnostics = new Map<string, Contexte>()) {
    super(new EntrepotsMemoire());
  }

  contextes = async (
    identifiantDiagnosticsLie: UUID[]
  ): Promise<Record<UUID, Contexte>> => {
    return identifiantDiagnosticsLie.reduce((prev, curr) => {
      return {
        ...prev,
        [curr]: this.diagnostics.get(curr) || unContexteVide().construis(),
      };
    }, {});
  };
}
