import { program } from 'commander';
import * as readline from 'node:readline';
import { Publication } from '../../../journalisation/Publication';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { EntrepotJournalisationPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotJournalisationPostgres';
import configurationJournalisation from '../../../infrastructure/entrepots/postgres/configurationJournalisation';

const command = program.description(
  'Exécute le rattrapage des événements de création des aidants cyber fantômes'
);

const entrepotJournalisation = new EntrepotJournalisationPostgres(
  configurationJournalisation
);

const evenementAidantCree = (idAidant: string) => ({
  identifiant: crypto.randomUUID(),
  type: 'AIDANT_CREE',
  date: FournisseurHorloge.enDate('2024-04-08T08:00:00'),
  donnees: {
    typeAidant: 'Aidant',
    departement: '',
    identifiant: idAidant,
  },
});

command.action(async () => {
  console.log('Collez dans le terminal tous les ID séparés par des virgules');

  const lecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  for await (const ligne of lecture) {
    const ids = ligne.split(',').map((id) => id.trim());

    console.log(`reçu ${ids.length} identifiants`);

    for (const id of ids) {
      const evenement: Publication = evenementAidantCree(id);
      console.log('Envoi de ', evenement);

      await entrepotJournalisation.persiste(evenement);
    }

    lecture.close();

    console.log('FIN');
  }

  process.exit(0);
});

program.parse();
