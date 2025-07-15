import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal, Publication } from './Publication';
import { DiagnosticLance } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { RechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotDemandeAide,
  RechercheDemandeAideComplete,
} from '../gestion-demandes/aide/DemandeAide';

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
    entrepotJournal: EntrepotEvenementJournal,
    rechercheUtilisateursMAC: RechercheUtilisateursMAC,
    entrepotDemandeAide: EntrepotDemandeAide
  ) =>
    new (class implements ConsommateurEvenement {
      async consomme<E extends Evenement<unknown>>(
        evenement: E
      ): Promise<void> {
        const { corps } = evenement as DiagnosticLance;
        const utilisateur =
          await rechercheUtilisateursMAC.rechercheParIdentifiant(
            corps.identifiantUtilisateur
          );
        const { emailEntite, ...reste } = corps;
        const demandeAide: RechercheDemandeAideComplete =
          (await entrepotDemandeAide.rechercheParEmail(
            corps.emailEntite
          )) as RechercheDemandeAideComplete;
        return entrepotJournal.persiste(
          genereEvenement({
            ...evenement,
            corps: {
              ...reste,
              profil: utilisateur?.profil,
              identifiantDemandeAide: demandeAide.demandeAide.identifiant,
            },
          })
        );
      }
    })();
export const diagnosticLance = consommateurDiagnosticLance();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

export const aideCree = consommateurEvenement();
export const demandeAidePourvue = consommateurEvenement();
export const affectationAnnulee = consommateurEvenement();

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

export const reponseTallyRecue = consommateurEvenement();

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
