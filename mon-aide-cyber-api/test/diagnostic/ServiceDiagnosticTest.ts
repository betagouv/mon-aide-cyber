import {
  Contexte,
  ServiceDiagnostic,
} from '../../src/diagnostic/ServiceDiagnostic';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import crypto from 'crypto';
import { unContexteVide } from './ConstructeurContexte';

export class ServiceDiagnosticTest extends ServiceDiagnostic {
  constructor(private readonly diagnostics = new Map<string, Contexte>()) {
    super(new EntrepotsMemoire());
  }

  contexte = async (identifiantDiagnostic: crypto.UUID): Promise<Contexte> => {
    return (
      this.diagnostics.get(identifiantDiagnostic) ||
      unContexteVide().construis()
    );
  };
}
