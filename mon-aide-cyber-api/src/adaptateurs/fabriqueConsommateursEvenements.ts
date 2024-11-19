import {
  aidantCree,
  aideCree,
  aideViaSollicitationAidantCree,
  autoDiagnosticLance,
  demandeDevenirAidantCree,
  demandeDevenirAidantespaceAidantCree,
  diagnosticLance,
  mailCreationCompteAidantEnvoye,
  mailCreationCompteAidantNonEnvoye,
  preferencesAidantModifiees,
  profilAidantModifie,
  reinitialisationMotDePasseDemandee,
  reinitialisationMotDePasseErronee,
  reinitialisationMotDePasseFaite,
  reponseAjoutee,
  restitutionLancee,
} from '../journalisation/evenements';
import { EntrepotJournalisationPostgres } from '../infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import configurationJournalisation from '../infrastructure/entrepots/postgres/configurationJournalisation';
import { ConsommateurEvenement, TypeEvenement } from '../domaine/BusEvenement';
import { EntrepotEvenementJournalMemoire } from '../infrastructure/entrepots/memoire/EntrepotMemoire';
import { EntrepotEvenementJournal } from '../journalisation/Publication';
import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { AdaptateurRelationsMAC } from '../relation/AdaptateurRelationsMAC';
import { aidantInitieDiagnostic } from '../espace-aidant/tableau-de-bord/consommateursEvenements';
import {
  demandeInitieAutoDiagnostic,
  envoiMailAutoDiagnostic,
} from '../auto-diagnostic/consommateursEvenements';
import { fabriqueAdaptateurEnvoiMail } from '../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { AdaptateurEnvoiMail } from './AdaptateurEnvoiMail';

const fabriqueEntrepotJournalisation = () => {
  return process.env.URL_JOURNALISATION_BASE_DONNEES
    ? new EntrepotJournalisationPostgres(configurationJournalisation)
    : new EntrepotEvenementJournalMemoire();
};

export const fabriqueConsommateursEvenements = (
  adaptateurRelations: AdaptateurRelations = new AdaptateurRelationsMAC(),
  entrepotJournalisation: EntrepotEvenementJournal = fabriqueEntrepotJournalisation(),
  adaptateurEnvoiMail: AdaptateurEnvoiMail = fabriqueAdaptateurEnvoiMail()
): Map<TypeEvenement, ConsommateurEvenement[]> => {
  return new Map<TypeEvenement, ConsommateurEvenement[]>([
    ['RESTITUTION_LANCEE', [restitutionLancee(entrepotJournalisation)]],
    [
      'DIAGNOSTIC_LANCE',
      [
        diagnosticLance(entrepotJournalisation),
        aidantInitieDiagnostic(adaptateurRelations),
      ],
    ],
    ['REPONSE_AJOUTEE', [reponseAjoutee(entrepotJournalisation)]],
    ['AIDANT_CREE', [aidantCree(entrepotJournalisation)]],
    ['AIDE_CREE', [aideCree(entrepotJournalisation)]],
    [
      'AIDE_VIA_SOLLICITATION_AIDANT_CREE',
      [aideViaSollicitationAidantCree(entrepotJournalisation)],
    ],
    [
      'DEMANDE_DEVENIR_AIDANT_CREEE',
      [demandeDevenirAidantCree(entrepotJournalisation)],
    ],
    [
      'MAIL_CREATION_COMPTE_AIDANT_ENVOYE',
      [mailCreationCompteAidantEnvoye(entrepotJournalisation)],
    ],
    [
      'MAIL_CREATION_COMPTE_AIDANT_NON_ENVOYE',
      [mailCreationCompteAidantNonEnvoye(entrepotJournalisation)],
    ],
    [
      'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE',
      [demandeDevenirAidantespaceAidantCree(entrepotJournalisation)],
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
      'AUTO_DIAGNOSTIC_LANCE',
      [
        autoDiagnosticLance(entrepotJournalisation),
        demandeInitieAutoDiagnostic(adaptateurRelations),
        envoiMailAutoDiagnostic(adaptateurEnvoiMail),
      ],
    ],
  ]);
};
