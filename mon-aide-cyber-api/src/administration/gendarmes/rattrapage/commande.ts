import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { trouveLesAidantsGendarmes } from './trouveLesAidantsGendarmes';
import { Aidant } from '../../../espace-aidant/Aidant';

program
  .description('Rattrape les gendarmes')
  .option('--dry-run <dryRun>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';
    console.log(
      `Le script tourne en mode : ${dryRunActif ? 'dry-run' : 'sans-dry-run'}`
    );

    const serviceDeChiffrement = adaptateurServiceChiffrement();
    const entrepotAidants = new EntrepotAidantPostgres(serviceDeChiffrement);

    const gendarmesExistants: Aidant[] =
      await trouveLesAidantsGendarmes(entrepotAidants);

    const gendarmesSansEntite = gendarmesExistants.filter(
      (g) => !g.entite || !g.entite.siret
    );

    console.log(
      `Nombre de comptes gendarmes à modifier : ${gendarmesSansEntite?.length} / ${gendarmesExistants.length} gendarmes`
    );

    if (gendarmesSansEntite.length > 0) {
      console.log({
        gendarmesSansEntite: gendarmesSansEntite.map((gse) => gse.identifiant),
      });
    }

    process.exit(0);
  });

program.parse();
