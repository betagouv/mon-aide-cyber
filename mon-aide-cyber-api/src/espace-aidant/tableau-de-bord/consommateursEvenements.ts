import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../../domaine/BusEvenement';
import { DiagnosticLance } from '../../diagnostic/CapteurCommandeLanceDiagnostic';

export const aidantInitieDiagnostic = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;

      return adaptateurRelations.aidantInitieDiagnostic(
        diagnosticLance.corps.identifiantAidant,
        diagnosticLance.corps.identifiantDiagnostic
      );
    }
  })();
