import {
  affectationAnnulee,
  aidantCree,
  aidantMigreEnUtilisateurInscrit,
  aideCree,
  demandeAidePourvue,
  demandeDevenirAidantCree,
  demandeDevenirAidantespaceAidantCree,
  demandeDevenirAidantInexistanteRecue,
  demandeDevenirAidantModifiee,
  diagnosticLance,
  diagnosticLibreAccesLance,
  mailCreationCompteAidantEnvoye,
  mailCreationCompteAidantNonEnvoye,
  preferencesAidantModifiees,
  profilAidantModifie,
  reinitialisationMotDePasseDemandee,
  reinitialisationMotDePasseErronee,
  reinitialisationMotDePasseFaite,
  reponseAjoutee,
  reponseTallyRecue,
  restitutionLancee,
  utilisateurInscritCree,
} from '../journalisation/evenements';
import { EntrepotJournalisationPostgres } from '../infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import configurationJournalisation from '../infrastructure/entrepots/postgres/configurationJournalisation';
import { ConsommateurEvenement, TypeEvenement } from '../domaine/BusEvenement';
import { EntrepotEvenementJournalMemoire } from '../infrastructure/entrepots/memoire/EntrepotMemoire';
import { EntrepotEvenementJournal } from '../journalisation/Publication';
import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { AdaptateurRelationsMAC } from '../relation/AdaptateurRelationsMAC';
import { aidantInitieDiagnostic } from '../espace-aidant/tableau-de-bord/consommateursEvenements';
import { demandeInitieDiagnosticLibreAcces } from '../diagnostic-libre-acces/consommateursEvenements';
import { fabriqueEntrepots } from './fabriqueEntrepots';
import { uneRechercheUtilisateursMAC } from '../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { utilisateurInscritInitieDiagnostic } from '../espace-utilisateur-inscrit/tableau-de-bord/consommateursEvenements';
import {
  entiteAideeBeneficieDiagnostic,
  restitutionEnvoyee,
} from '../diagnostic/consommateursEvenements';
import { adaptateurRepertoireDeContacts } from './adaptateurRepertoireDeContacts';
import { Entrepots } from '../domaine/Entrepots';

const fabriqueEntrepotJournalisation = () => {
  return process.env.URL_JOURNALISATION_BASE_DONNEES
    ? new EntrepotJournalisationPostgres(configurationJournalisation)
    : new EntrepotEvenementJournalMemoire();
};

export const fabriqueConsommateursEvenements = (
  adaptateurRelations: AdaptateurRelations = new AdaptateurRelationsMAC(),
  entrepotJournalisation: EntrepotEvenementJournal = fabriqueEntrepotJournalisation(),
  consommateurs: {
    aidantCree: () => ConsommateurEvenement;
    aideCree: () => ConsommateurEvenement;
  } = {
    aidantCree: () => aidantCree(entrepotJournalisation),
    aideCree: () => aideCree(entrepotJournalisation),
  },
  entrepots: Entrepots = fabriqueEntrepots()
): Map<TypeEvenement, ConsommateurEvenement[]> => {
  return new Map<TypeEvenement, ConsommateurEvenement[]>([
    ['RESTITUTION_LANCEE', [restitutionLancee(entrepotJournalisation)]],
    [
      'RESTITUTION_ENVOYEE',
      [restitutionEnvoyee(adaptateurRepertoireDeContacts())],
    ],
    [
      'DIAGNOSTIC_LANCE',
      [
        diagnosticLance(
          entrepotJournalisation,
          uneRechercheUtilisateursMAC(entrepots.utilisateursMAC()),
          entrepots.demandesAides()
        ),
        aidantInitieDiagnostic(
          adaptateurRelations,
          uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
        ),
        utilisateurInscritInitieDiagnostic(
          adaptateurRelations,
          uneRechercheUtilisateursMAC(entrepots.utilisateursMAC())
        ),
        entiteAideeBeneficieDiagnostic(
          adaptateurRelations,
          adaptateurRepertoireDeContacts()
        ),
      ],
    ],
    ['REPONSE_AJOUTEE', [reponseAjoutee(entrepotJournalisation)]],
    ['AIDANT_CREE', [consommateurs.aidantCree()]],
    ['AIDE_CREE', [consommateurs.aideCree()]],
    ['DEMANDE_AIDE_POURVUE', [demandeAidePourvue(entrepotJournalisation)]],
    ['AFFECTATION_ANNULEE', [affectationAnnulee(entrepotJournalisation)]],
    [
      'DEMANDE_DEVENIR_AIDANT_CREEE',
      [demandeDevenirAidantCree(entrepotJournalisation)],
    ],
    [
      'DEMANDE_DEVENIR_AIDANT_MODIFIEE',
      [demandeDevenirAidantModifiee(entrepotJournalisation)],
    ],
    [
      'MAIL_COMPTE_AIDANT_ACTIVE_ENVOYE',
      [mailCreationCompteAidantEnvoye(entrepotJournalisation)],
    ],
    [
      'MAIL_COMPTE_AIDANT_ACTIVE_NON_ENVOYE',
      [mailCreationCompteAidantNonEnvoye(entrepotJournalisation)],
    ],
    [
      'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE',
      [demandeDevenirAidantespaceAidantCree(entrepotJournalisation)],
    ],
    [
      'DEMANDE_DEVENIR_AIDANT_INEXISTANTE_RECUE',
      [demandeDevenirAidantInexistanteRecue()],
    ],
    [
      'PREFERENCES_AIDANT_MODIFIEES',
      [preferencesAidantModifiees(entrepotJournalisation)],
    ],
    ['PROFIL_AIDANT_MODIFIE', [profilAidantModifie(entrepotJournalisation)]],
    [
      'REINITIALISATION_MOT_DE_PASSE_DEMANDEE',
      [reinitialisationMotDePasseDemandee(entrepotJournalisation)],
    ],
    [
      'REINITIALISATION_MOT_DE_PASSE_FAITE',
      [reinitialisationMotDePasseFaite(entrepotJournalisation)],
    ],
    [
      'REINITIALISATION_MOT_DE_PASSE_ERRONEE',
      [reinitialisationMotDePasseErronee(entrepotJournalisation)],
    ],
    [
      'DIAGNOSTIC_LIBRE_ACCES_LANCE',
      [
        diagnosticLibreAccesLance(entrepotJournalisation),
        demandeInitieDiagnosticLibreAcces(adaptateurRelations),
      ],
    ],
    [
      'UTILISATEUR_INSCRIT_CREE',
      [utilisateurInscritCree(entrepotJournalisation)],
    ],
    [
      'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT',
      [aidantMigreEnUtilisateurInscrit(entrepotJournalisation)],
    ],
    ['REPONSE_TALLY_RECUE', [reponseTallyRecue(entrepotJournalisation)]],
  ]);
};
