import { program } from 'commander';
import * as fs from 'fs';
import { Aidant } from './Types';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import {
  EntrepotAidantPostgres,
  ExtractionAidantSelonParametre,
} from './extractionAidantSelonParametre';
import { intlFormat } from 'date-fns';

export type ParametreExtraction =
  | 'SANS_DIAGNOSTIC'
  | 'EXACTEMENT_UN_DIAGNOSTIC'
  | 'AU_MOINS_DEUX_DIAGNOSTICS'
  | 'AU_MOINS_CINQ_DIAGNOSTICS'
  | 'NOMBRE_DIAGNOSTICS';

const estTypeExport = (
  valeur: any | ParametreExtraction
): valeur is ParametreExtraction => {
  return (
    valeur === 'SANS_DIAGNOSTIC' ||
    valeur === 'EXACTEMENT_UN_DIAGNOSTIC' ||
    valeur === 'AU_MOINS_DEUX_DIAGNOSTICS' ||
    valeur === 'AU_MOINS_CINQ_DIAGNOSTICS' ||
    valeur === 'NOMBRE_DIAGNOSTICS'
  );
};
const command = program
  .description("Exporte les Aidants en fonction du type d'export souhaité")
  .option(
    '-t, --type <type>',
    "Le type d'export souhaité SANS_DIAGNOSTIC, EXACTEMENT_UN_DIAGNOSTIC, AU_MOINS_DEUX_DIAGNOSTICS, AU_MOINS_CINQ_DIAGNOSTICS, NOMBRE_DIAGNOSTICS",
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

const versLigneCSV = (aidant: Aidant, typeExport: ParametreExtraction) => {
  if (typeExport === 'NOMBRE_DIAGNOSTICS')
    return `${aidant.nomPrenom};${aidant.email};${formatteLaDate(aidant.compteCree)};${aidant.nombreDiagnostics};\n`;
  return `${aidant.nomPrenom};${aidant.email};${formatteLaDate(aidant.compteCree)};\n`;
};

command.action(async (options) => {
  const typeExport = options.type;

  if (!estTypeExport(typeExport)) {
    console.error(`Le type de la requête est incorrect`);
    process.exit(1);
  }

  const rapport: string[] = [];
  const resultat = await new ExtractionAidantSelonParametre(
    new EntrepotAidantPostgres(adaptateurServiceChiffrement())
  ).extrais(typeExport);

  console.log('Nombre d’Aidants trouvés : %d', resultat.length);
  resultat.forEach((aidant) => {
    rapport.push(versLigneCSV(aidant, typeExport));
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
