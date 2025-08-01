import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { Aidant } from '../../../espace-aidant/Aidant';

const l = console.log;

program
  .description("Modifie les emails de comptes d'Utilisateurs")
  .requiredOption(
    '--modifications <specificationsDesModifications>',
    'Tous les changements à fait, séparés par des | et avec " autour\n' +
      'Exemple pour changer "ancien" en "nouveau", et "rouge" en "bleu" : \n' +
      '"ancien@mail.fr,nouveau@mail.fr|rouge@mail.fr,bleu@mail.fr"'
  )
  .option('--dry-run <trueOuFalse>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';

    const modifications = options.modifications
      .split('|')
      .map((m: string) => m.trim());

    const todo = modifications.map((m: string) => {
      const [ancien, nouveau] = m.split(',');
      return { ancien, nouveau };
    });

    l(`🗒️  Vous avez demandé les changements d'email suivants :`);
    l(todo);

    if (dryRunActif) {
      l(`🧪 Le mode dry-run est actif ! On s'arrête là…`);
      process.exit(0);
    }

    l(`🚚 C'est parti…`);

    const entrepotAidants = new EntrepotAidantPostgres(
      adaptateurServiceChiffrement()
    );

    const tousLesAidants: Aidant[] = await entrepotAidants.tous();

    for (const { ancien, nouveau } of todo) {
      const utilisateurActuel = tousLesAidants.find(
        (u) => u.email.toLowerCase().trim() === ancien.toLowerCase().trim()
      ) as Aidant;

      if (!utilisateurActuel) {
        l(`🔴 ${ancien} : email non trouvé chez MAC`);
        continue;
      }

      await entrepotAidants.persiste({ ...utilisateurActuel, email: nouveau });
      l(`🟢 ${ancien} : email modifié en ${nouveau}`);
    }

    process.exit(0);
  });

program.parse();
