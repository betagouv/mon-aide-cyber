import { program } from 'commander';
import readline from 'node:readline';
import fs from 'fs';
import {
  executeLaRechercheDesAidants,
  ResultatChallenge,
} from './executeLaRechercheDesAidants';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

const command = program.description(
  'Retourne la liste des Aidants ayant participé au challenge'
);

command.action(async () => {
  console.log(
    'Collez dans le terminal le résultat du modèle [DIAGS][DIRECT AIDANTS] Le nombre de diags par mois au format CSV'
  );

  const lecture = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  const resultats = [];

  const tousLesAidants = await new EntrepotAidantPostgres(
    adaptateurServiceChiffrement()
  ).tous();

  for await (const ligne of lecture) {
    resultats.push(executeLaRechercheDesAidants(ligne, tousLesAidants));

    lecture.close();
  }
  console.log('FIN');

  const rapport: string[] = ['Nom;Période;Nombre de diagnostics;\n'];
  resultats
    .filter((r): r is ResultatChallenge => !!r)
    .forEach((result) =>
      rapport.push(
        `${result.nomPrenom};${result.date};${result.nombreDiagnostics};\n`
      )
    );

  fs.writeFileSync(`/tmp/rapport-challenge-rentree.csv`, rapport.join(''), {
    encoding: 'utf-8',
  });

  process.exit(0);
});

program.parse();
