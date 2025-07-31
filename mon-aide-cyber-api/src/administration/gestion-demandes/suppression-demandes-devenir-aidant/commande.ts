import { program } from 'commander';
import { EntrepotDemandeDevenirAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotDemandeDevenirAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { DemandeDevenirAidant } from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { Knex, knex } from 'knex';

const supprimeLaDemande = async (
  mailASupprimer: string,
  toutesLesDemandes: DemandeDevenirAidant[],
  connexionKnex: Knex,
  avancement: { courante: number; total: number }
) => {
  const position = () =>
    `[${avancement.courante.toString().padStart(3)} / ${avancement.total}]`;

  const demandeTrouvee = toutesLesDemandes.find(
    (d) => d.mail.toLowerCase().trim() === mailASupprimer.toLowerCase().trim()
  );

  if (!demandeTrouvee)
    return `${position()} 🔴 ${mailASupprimer} : aucune demande trouvée`;

  await connexionKnex.raw(
    `DELETE FROM "demandes-devenir-aidant" WHERE id = ?`,
    [demandeTrouvee.identifiant]
  );
  return `${position()} 🟢 ${mailASupprimer} : demande trouvée et supprimée`;
};

program
  .description('Supprime des demandes devenir aidant, via les emails associés')
  .requiredOption(
    '--emails <emails>',
    'Tous les emails séparés par des virgules'
  )
  .option('--dry-run <dryRun>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';

    const tousLesMails: string[] = options.emails
      .split(',')
      .map((mail: string) => mail.trim());

    console.log(
      `🗒️  Vous avez demandé la suppression de ${tousLesMails.length} demande(s) devenir aidant.`
    );

    if (dryRunActif) {
      console.log(`🧪 Le mode dry-run est actif ! On s'arrête là…`);
      process.exit(0);
    }

    console.log(`🚚 C'est parti…`);

    const entrepot = new EntrepotDemandeDevenirAidantPostgres(
      adaptateurServiceChiffrement()
    );
    const demandes = await entrepot.tous();
    const connexionKnex = knex(knexfile);
    const lesResultatsDeSuppressions = tousLesMails.map(
      async (mail, i) =>
        await supprimeLaDemande(mail, demandes, connexionKnex, {
          courante: i + 1,
          total: tousLesMails.length,
        })
    );

    for (const supprimeUn of lesResultatsDeSuppressions) {
      const resultat = await supprimeUn;
      console.log(resultat);
    }

    process.exit(0); // On ne traite que la première ligne
  });

program.parse();
