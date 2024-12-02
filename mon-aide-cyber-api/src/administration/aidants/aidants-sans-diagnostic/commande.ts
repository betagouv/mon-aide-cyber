import { program } from 'commander';
import * as fs from 'fs';
import { Aidant } from './Types';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import {
  EntrepotAidantPostgres,
  ExtractionAidantSansDiagnostic,
} from './extractionAidantSansDiagnostic';
import { intlFormat } from 'date-fns';

const command = program.description(
  "Exporte les Aidants n'ayant effectué aucun diagnostic"
);

const formatteLaDate = (date?: Date): string =>
  date
    ? intlFormat(
        date,
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        {
          locale: 'fr-FR',
        }
      )
    : 'Jamais connecté';

const versLigneCSV = (aidant: Aidant) =>
  `${aidant.nomPrenom};${aidant.email};${formatteLaDate(aidant.compteCree)};\n`;

command.action(async () => {
  const rapport: string[] = [];
  const resultat = await new ExtractionAidantSansDiagnostic(
    new EntrepotAidantPostgres(adaptateurServiceChiffrement())
  ).extrais();

  console.log('Nombre d’Aidants trouvés : %d', resultat.length);
  resultat.forEach((aidant) => {
    rapport.push(versLigneCSV(aidant));
  });

  fs.writeFileSync(
    `/tmp/rapport-aidants-sans-diagnostic-${FournisseurHorloge.maintenant().toISOString()}.csv`,
    rapport.join(''),
    {
      encoding: 'utf-8',
    }
  );

  process.exit(0);
});

program.parse();
