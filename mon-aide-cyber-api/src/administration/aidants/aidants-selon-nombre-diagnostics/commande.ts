import { program } from 'commander';
import * as fs from 'fs';
import { Aidant } from './Types';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import {
  EntrepotAidantPostgres,
  ExtractionAidantSelonNombreDiagnostics,
} from './extractionAidantSelonNombreDiagnostics';
import { intlFormat } from 'date-fns';

export type ParametreAidantsSelonNombreDiagnostics =
  | 'SANS_DIAGNOSTIC'
  | 'AU_MOINS_DEUX_DIAGNOSTICS'
  | 'AU_MOINS_CINQ_DIAGNOSTICS';

const estTypeExport = (
  valeur: any | ParametreAidantsSelonNombreDiagnostics
): valeur is ParametreAidantsSelonNombreDiagnostics => {
  return (
    valeur === 'SANS_DIAGNOSTIC' ||
    valeur === 'AU_MOINS_DEUX_DIAGNOSTICS' ||
    valeur === 'AU_MOINS_CINQ_DIAGNOSTICS'
  );
};
const command = program
  .description("Exporte les Aidants en fonction du type d'export souhaité")
  .option(
    '-t, --type <type>',
    "Le type d'export souhaité SANS_DIAGNOSTIC, AU_MOINS_DEUX_DIAGNOSTICS, AU_MOINS_CINQ_DIAGNOSTICS",
    'SANS_DIAGNOSTIC'
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

command.action(async (options) => {
  const typeExport = options.type;

  if (!estTypeExport(typeExport)) {
    console.error(`Le type de la requête est incorrect`);
    process.exit(1);
  }

  const rapport: string[] = [];
  const resultat = await new ExtractionAidantSelonNombreDiagnostics(
    new EntrepotAidantPostgres(adaptateurServiceChiffrement())
  ).extrais(typeExport);

  console.log('Nombre d’Aidants trouvés : %d', resultat.length);
  resultat.forEach((aidant) => {
    rapport.push(versLigneCSV(aidant));
  });

  fs.writeFileSync(
    `/tmp/rapport-aidants-${typeExport}-${FournisseurHorloge.maintenant().toISOString()}.csv`,
    rapport.join(''),
    {
      encoding: 'utf-8',
    }
  );

  process.exit(0);
});

program.parse();
