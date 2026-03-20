import { program } from 'commander';
import { lesAidesNonPourvues } from './aidesNonPourvues';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import * as fs from 'node:fs/promises';
import path from 'node:path';

const command = program.description(
  'Obtenir la liste des demandes d’Aides non pourvues'
);

command.action(async () => {
  console.log('Obtention des aides non pourvues démarrée');

  const aidesNonPourvues = await lesAidesNonPourvues(
    fabriqueEntrepots(),
    new AdaptateurRelationsMAC()
  ).recherche();

  console.log(`Obtention des aides non pourvues terminée :`);
  console.log(
    `- ${aidesNonPourvues.demandesSansDiagnostic.length} demandes sans diagnostic`
  );
  const cheminFichier = path.join(
    process.cwd(),
    'tmp',
    'aides-non-pourvues.json'
  );
  try {
    await fs.mkdir(path.dirname(cheminFichier), { recursive: true });
    await fs.writeFile(
      cheminFichier,
      JSON.stringify(aidesNonPourvues, undefined, 2),
      'utf-8'
    );
    console.log(`Résultat écrit dans le fichier : ${cheminFichier}`);
  } catch (erreur) {
    console.error(
      `Erreur lors de l'écriture du fichier ${cheminFichier}`,
      erreur
    );
  }

  process.exit(0);
});

program.parse();
