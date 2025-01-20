import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import { RechercheUtilisateursMAC } from '../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { ConsommateurEvenement, Evenement } from '../../domaine/BusEvenement';
import { DiagnosticLance } from '../../diagnostic/CapteurCommandeLanceDiagnostic';
import { unTupleUtilisateurInscritInitieDiagnostic } from '../../diagnostic/tuples';

export const utilisateurInscritInitieDiagnostic = (
  adaptateurRelations: AdaptateurRelations,
  rechercheUtilisateursMAC: RechercheUtilisateursMAC
): ConsommateurEvenement => {
  return new (class implements ConsommateurEvenement {
    async consomme<E extends Evenement<unknown> = DiagnosticLance>(
      evenement: E
    ): Promise<void> {
      const diagnosticLance = evenement as DiagnosticLance;
      return rechercheUtilisateursMAC
        .rechercheParIdentifiant(diagnosticLance.corps.identifiantUtilisateur)
        .then((utilisateur) => {
          if (utilisateur && utilisateur.profil === 'UtilisateurInscrit') {
            const tuple = unTupleUtilisateurInscritInitieDiagnostic(
              diagnosticLance.corps.identifiantUtilisateur,
              diagnosticLance.corps.identifiantDiagnostic
            );
            return adaptateurRelations.creeTuple(tuple);
          }
          return;
        });
    }
  })();
};
