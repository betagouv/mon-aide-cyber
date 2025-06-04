import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLance } from './CapteurCommandeLanceDiagnostic';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export const entiteAideeBeneficieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  repertoirDeContacts: RepertoireDeContacts
): ConsommateurEvenement =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;

      await adaptateurRelations.creeTupleEntiteAideeBeneficieDiagnostic(
        diagnosticLance.corps.identifiantDiagnostic,
        diagnosticLance.corps.emailEntite
      );

      await repertoirDeContacts.emetsEvenement({
        email: diagnosticLance.corps.emailEntite,
        type: 'DIAGNOSTIC_DEMARRE',
      });
    }
  })();
