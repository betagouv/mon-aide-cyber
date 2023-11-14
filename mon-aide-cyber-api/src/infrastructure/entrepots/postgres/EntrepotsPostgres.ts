import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidant } from '../../../authentification/Aidant';

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    throw new Error('Non implémenté');
  }
}
