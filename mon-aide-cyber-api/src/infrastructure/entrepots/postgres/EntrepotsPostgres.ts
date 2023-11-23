import { Entrepots } from '../../../domaine/Entrepots';
import { EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { EntrepotDiagnosticPostgres } from './EntrepotDiagnosticPostgres';
import { EntrepotAidant } from '../../../authentification/Aidant';
import { EntrepotAidantPostgres } from './EntrepotAidantPostgres';
import { ServiceDeChiffrement } from '../../securite/ServiceChiffrement';

export class EntrepotsPostgres implements Entrepots {
  private readonly entrepotDiagnostic = new EntrepotDiagnosticPostgres();
  private readonly entrepotAidant: EntrepotAidant = new EntrepotAidantPostgres(
    new ServiceDeChiffrement(),
  );

  diagnostic(): EntrepotDiagnostic {
    return this.entrepotDiagnostic;
  }

  aidants(): EntrepotAidant {
    return this.entrepotAidant;
  }
}
