import {
  aidantCree,
  diagnosticLance,
  restitutionLancee,
  reponseAjoutee,
} from '../journalisation/evenements';
import { EntrepotJournalisationPostgres } from '../infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import configurationJournalisation from '../infrastructure/entrepots/postgres/configurationJournalisation';
import { ConsommateurEvenement, TypeEvenement } from '../domaine/BusEvenement';
import { EntrepotEvenementJournalMemoire } from '../infrastructure/entrepots/memoire/EntrepotMemoire';
import { EntrepotEvenementJournal } from '../journalisation/Publication';

const fabriqueEntrepotJournalisation = () => {
  return process.env.URL_JOURNALISATION_BASE_DONNEES
    ? new EntrepotJournalisationPostgres(configurationJournalisation)
    : new EntrepotEvenementJournalMemoire();
};

export const fabriqueConsommateursEvenements = (
  entrepotJournalisation: EntrepotEvenementJournal = fabriqueEntrepotJournalisation(),
  configuration: { aidantCree: () => ConsommateurEvenement } = {
    aidantCree: () => aidantCree(entrepotJournalisation),
  },
) => {
  return new Map<TypeEvenement, ConsommateurEvenement>([
    ['RESTITUTION_LANCEE', restitutionLancee(entrepotJournalisation)],
    ['DIAGNOSTIC_LANCE', diagnosticLance(entrepotJournalisation)],
    ['REPONSE_AJOUTEE', reponseAjoutee(entrepotJournalisation)],
    ['AIDANT_CREE', configuration.aidantCree()],
  ]);
};
