import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { ConsommateurEvenement, Evenement } from '../../domaine/BusEvenement';
import { DiagnosticLance } from '../../diagnostic/CapteurCommandeLanceDiagnostic';
import { unTupleAidantInitieDiagnostic } from '../../diagnostic/tuples';
import {
  ProfilAidant,
  RechercheUtilisateursMAC,
} from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

const profilsAidants: ProfilAidant[] = ['Aidant', 'Gendarme'];
export const aidantInitieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  rechercheUtilisateursMAC: RechercheUtilisateursMAC
) =>
  new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;
      return rechercheUtilisateursMAC
        .rechercheParIdentifiant(diagnosticLance.corps.identifiantUtilisateur)
        .then((utilisateur) => {
          if (utilisateur && profilsAidants.includes(utilisateur.profil)) {
            const tuple = unTupleAidantInitieDiagnostic(
              diagnosticLance.corps.identifiantUtilisateur,
              diagnosticLance.corps.identifiantDiagnostic
            );
            return adaptateurRelations.creeTuple(tuple);
          }
          return;
        });
    }
  })();
