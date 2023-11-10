import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotAidant } from '../../../authentification/Aidant';
import { EntrepotDiagnosticPostgres } from './diagnostic/EntrepotDiagnosticPostgres';

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    throw new Error('Non implémenté');
  }
}
