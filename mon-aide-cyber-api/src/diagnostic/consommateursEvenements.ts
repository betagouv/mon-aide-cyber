import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import { DiagnosticLance } from './CapteurCommandeLanceDiagnostic';
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';
import { RestitutionEnvoyee } from '../api/routesAPIDiagnostic';

export const entiteAideeBeneficieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  repertoireDeContacts: RepertoireDeContacts
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

      await repertoireDeContacts.emetsEvenement({
        email: diagnosticLance.corps.emailEntite,
        type: 'DIAGNOSTIC_DEMARRE',
      });
    }
  })();

export const restitutionEnvoyee = (
  repertoireDeContacts: RepertoireDeContacts
): ConsommateurEvenement =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
      const restitutionEnvoye = evenement as RestitutionEnvoyee;
      await repertoireDeContacts.emetsEvenement({
        email: restitutionEnvoye.corps.emailEntiteAidee,
        type: 'RESTITUTION_ENVOYEE',
      });
    }
  })();
