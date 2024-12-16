import {
  aidantCree,
  aideCree,
  aideViaSollicitationAidantCree,
  demandeDevenirAidantCree,
  demandeDevenirAidantespaceAidantCree,
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
import { demandeInitieDiagnosticLibreAcces } from '../diagnostic-libre-acces/consommateursEvenements';
import { unServiceAidant } from '../espace-aidant/ServiceAidantMAC';
import { fabriqueEntrepots } from './fabriqueEntrepots';

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
  }
): Map<TypeEvenement, ConsommateurEvenement[]> => {
  return new Map<TypeEvenement, ConsommateurEvenement[]>([
    ['RESTITUTION_LANCEE', [restitutionLancee(entrepotJournalisation)]],
    [
      'DIAGNOSTIC_LANCE',
      [
        diagnosticLance(
          entrepotJournalisation,
          unServiceAidant(fabriqueEntrepots().aidants())
        ),
        aidantInitieDiagnostic(adaptateurRelations),
      ],
    ],
    ['REPONSE_AJOUTEE', [reponseAjoutee(entrepotJournalisation)]],
    ['AIDANT_CREE', [consommateurs.aidantCree()]],
    ['AIDE_CREE', [consommateurs.aideCree()]],
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
      'DIAGNOSTIC_LIBRE_ACCES_LANCE',
      [
        diagnosticLibreAccesLance(entrepotJournalisation),
        demandeInitieDiagnosticLibreAcces(adaptateurRelations),
      ],
    ],
  ]);
};
