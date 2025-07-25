import { ConsommateurEvenement, Evenement } from '../domaine/BusEvenement';
import crypto from 'crypto';
import { EntrepotEvenementJournal, Publication } from './Publication';
import { DiagnosticLance } from '../diagnostic/CapteurCommandeLanceDiagnostic';
import { RechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import {
  EntrepotDemandeAide,
  RechercheDemandeAideComplete,
} from '../gestion-demandes/aide/DemandeAide';
import { Messagerie } from '../infrastructure/adaptateurs/AdaptateurMessagerieMattermost';
import { adaptateurMessagerie } from '../adaptateurs/adaptateurMessagerie';
import {
  DemandeInexistanteRecue,
  MailCompteAidantActiveEnvoye,
  MailCompteAidantActiveNonEnvoye,
} from '../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';

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

const consommateurDemandeDevenirAidantInexsitanteRecue =
  () =>
  (messagerie: Messagerie = adaptateurMessagerie()) =>
    new (class implements ConsommateurEvenement {
      async consomme<E extends Evenement<unknown>>(
        evenement: E
      ): Promise<void> {
        const demande = evenement as DemandeInexistanteRecue;
        await messagerie.envoieMessageMarkdown(
          `#### Activation compte Aidant : \n > Une requête d‘activation de compte Aidant a été faite avec un email inconnu \n\n Email de l'Aidant : ${demande.corps.emailDemande}`
        );
      }
    })();

const consommateurCompteAidantActive =
  () =>
  (
    entrepotJournalisation: EntrepotEvenementJournal,
    messagerie: Messagerie = adaptateurMessagerie()
  ) => {
    return new (class implements ConsommateurEvenement {
      async consomme<E extends Evenement<unknown>>(
        evenement: E
      ): Promise<void> {
        const compteAidantActive = evenement as MailCompteAidantActiveEnvoye;
        await entrepotJournalisation.persiste(
          genereEvenement(compteAidantActive)
        );
        await messagerie.envoieMessageMarkdown(
          `#### :partying_face: Activation compte Aidant : \n > Activation faite pour la demande ${compteAidantActive.identifiant}`
        );
      }
    })();
  };

const consommateurCompteAidantActiveMailNonEnvoye =
  () =>
  (
    entrepotJournalisation: EntrepotEvenementJournal,
    messagerie: Messagerie = adaptateurMessagerie()
  ) => {
    return new (class implements ConsommateurEvenement {
      async consomme<E extends Evenement<unknown>>(
        evenement: E
      ): Promise<void> {
        const { corps, ...reste } =
          evenement as MailCompteAidantActiveNonEnvoye;
        await entrepotJournalisation.persiste(
          genereEvenement({
            ...reste,
            corps: {
              identifiantDemande: corps.identifiantDemande,
            },
          })
        );
        await messagerie.envoieMessageMarkdown(
          `#### :alert: Activation compte Aidant : \n > Le mail d‘activation n‘ pu être remis pour la demande ${corps.identifiantDemande} (erreur: '${corps.erreur}')`
        );
      }
    })();
  };

export const diagnosticLance = consommateurDiagnosticLance();

export const reponseAjoutee = consommateurEvenement();

export const aidantCree = consommateurEvenement();

export const aideCree = consommateurEvenement();
export const demandeAidePourvue = consommateurEvenement();
export const affectationAnnulee = consommateurEvenement();

export const demandeDevenirAidantCree = consommateurEvenement();
export const demandeDevenirAidantModifiee = consommateurEvenement();

export const mailCreationCompteAidantEnvoye = consommateurCompteAidantActive();

export const mailCreationCompteAidantNonEnvoye =
  consommateurCompteAidantActiveMailNonEnvoye();

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

export const demandeDevenirAidantInexistanteRecue =
  consommateurDemandeDevenirAidantInexsitanteRecue();

export const compteAidantDejaExistant = consommateurEvenement();

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
