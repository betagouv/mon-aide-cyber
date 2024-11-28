import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../../domaine/BusEvenement';
import { DiagnosticLance } from '../../diagnostic/evenements';
import { unTupleAidantInitieDiagnostic } from '../../diagnostic/tuples';

export const aidantInitieDiagnostic = (
  adaptateurRelations: AdaptateurRelations
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;
      const tuple = unTupleAidantInitieDiagnostic(
        diagnosticLance.corps.origine.identifiant,
        diagnosticLance.corps.identifiantDiagnostic
      );

      return adaptateurRelations.creeTuple(tuple);
    }
  })();
