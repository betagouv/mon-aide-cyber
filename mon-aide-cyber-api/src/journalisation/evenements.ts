import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal, Publication } from './Publication';
import { DiagnosticLance } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { RechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

const consommateurEvenement = () => (entrepot: EntrepotEvenementJournal) =>
  new (class implements ConsommateurEvenement {
    consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
      return entrepot.persiste(genereEvenement(evenement));
    }
  })();

export const restitutionLancee = consommateurEvenement();

const consommateurDiagnosticLance =
  () =>
  (
    entrepot: EntrepotEvenementJournal,
    rechercheUtilisateursMAC: RechercheUtilisateursMAC
  ) =>
    new (class implements ConsommateurEvenement {
      consomme<E extends Evenement<unknown>>(evenement: E): Promise<void> {
        const { corps } = evenement as DiagnosticLance;
        return rechercheUtilisateursMAC
          .rechercheParIdentifiant(corps.identifiantUtilisateur)
          .then((utilisateur) => {
            return entrepot.persiste(
              genereEvenement({
                ...evenement,
                corps: {
                  ...corps,
                  profil: utilisateur?.profil,
                },
              })
            );
          });
      }
    })();
export const diagnosticLance = consommateurDiagnosticLance();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

export const aideCree = consommateurEvenement();

export const aideViaSollicitationAidantCree = consommateurEvenement();

export const demandeDevenirAidantCree = consommateurEvenement();
export const demandeDevenirAidantModifiee = consommateurEvenement();

export const mailCreationCompteAidantEnvoye = consommateurEvenement();

export const mailCreationCompteAidantNonEnvoye = consommateurEvenement();

export const demandeDevenirAidantespaceAidantCree = consommateurEvenement();

export const preferencesAidantModifiees = consommateurEvenement();

export const profilAidantModifie = consommateurEvenement();

export const reinitialisationMotDePasseDemandee = consommateurEvenement();

export const reinitialisationMotDePasseFaite = consommateurEvenement();

export const reinitialisationMotDePasseErronee = consommateurEvenement();

export const diagnosticLibreAccesLance = consommateurEvenement();

export const utilisateurInscritCree = consommateurEvenement();

export const aidantMigreEnUtilisateurInscrit = consommateurEvenement();

const genereEvenement = <E extends Evenement<unknown>>(
  evenement: E
): Publication => {
  return {
    date: evenement.date,
    donnees: evenement.corps as object,
    identifiant: crypto.randomUUID(),
    type: evenement.type,
  };
};
