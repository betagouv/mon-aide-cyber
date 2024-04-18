import {
  aidantCree,
  aideCree,
  diagnosticLance,
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
    ['AIDANT_CREE', [consommateurs.aidantCree()]],
    ['AIDE_CREE', [consommateurs.aideCree()]],
  ]);
};
