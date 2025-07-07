import { program } from 'commander';
import * as readline from 'node:readline';
import { executeMiseEnRelation } from './executeMiseEnRelation';

const command = program.description(
  'Exécute l’envoi du mail de mise en relation des aidants'
);

command.action(async () => {
  console.log(
    'Collez dans le terminal tous les mails des Aidés séparés par des virgules'
  );

  const lecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  for await (const ligne of lecture) {
    const mailsEntites = ligne.split(',').map((id) => id.trim());

    console.log(`reçu ${mailsEntites.length} mails`);

    for (const mailEntite of mailsEntites) {
      await executeMiseEnRelation(mailEntite.trim().toLowerCase());
    }

    lecture.close();

    console.log('FIN');
  }

  process.exit(0);
});

program.parse();
