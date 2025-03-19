import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLance } from './CapteurCommandeLanceDiagnostic';
import { unTupleEntiteAideeBeneficieDiagnostic } from './tuples';
import { ServiceDeHashage } from '../securite/ServiceDeHashage';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export const entiteAideeBeneficieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  serviceDeChiffrement: ServiceDeHashage,
  repertoirDeContacts: RepertoireDeContacts
): ConsommateurEvenement =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;
      const tuple = unTupleEntiteAideeBeneficieDiagnostic(
        diagnosticLance.corps.identifiantDiagnostic,
        serviceDeChiffrement.hashe(diagnosticLance.corps.emailEntite)
      );
      await adaptateurRelations.creeTuple(tuple);
      await repertoirDeContacts.emetsEvenement({
        email: diagnosticLance.corps.emailEntite,
        type: 'DIAGNOSTIC_DEMARRE',
      });
    }
  })();
