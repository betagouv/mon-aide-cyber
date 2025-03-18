import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLance } from './CapteurCommandeLanceDiagnostic';
import { unTupleEntiteAideeBeneficieDiagnostic } from './tuples';
import { ServiceDeHashage } from '../securite/ServiceDeHashage';

export const entiteAideeBeneficieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  serviceDeChiffrement: ServiceDeHashage
): ConsommateurEvenement =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;
      const tuple = unTupleEntiteAideeBeneficieDiagnostic(
        diagnosticLance.corps.identifiantDiagnostic,
        serviceDeChiffrement.hashe(diagnosticLance.corps.emailEntite)
      );
      return adaptateurRelations.creeTuple(tuple);
    }
  })();
