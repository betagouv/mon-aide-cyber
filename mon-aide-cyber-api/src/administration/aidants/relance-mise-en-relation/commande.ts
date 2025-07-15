import { program } from 'commander';
import readline from 'node:readline';
import { executeRelanceMiseEnRelation } from './executeRelanceMiseEnRelation';

const command = program.description(
  'Relance une mise en relation suite à l‘annulation d‘une affectation par un Aidant'
);

command.action(async () => {
  console.log(
    'Collez dans le terminal tous les mails des Aidés séparés par des virgules pour lesquels la mise en relation va être relancée'
  );

  const lecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  for await (const ligne of lecture) {
    const mailsEntites = ligne.split(',').map((id) => id.trim());

    console.log(
      `${mailsEntites.length} demande(s) d'aide(s) vont être relancées suite à l'annulation d'une affectation`
    );

    for (const mailEntite of mailsEntites) {
      await executeRelanceMiseEnRelation(mailEntite.trim().toLowerCase());
    }

    lecture.close();

    console.log('FIN');
  }

  process.exit(0);
});

program.parse();
