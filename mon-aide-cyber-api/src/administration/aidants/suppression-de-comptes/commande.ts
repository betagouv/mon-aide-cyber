import { program } from 'commander';
import { EntrepotUtilisateurMACPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotUtilisateurMACPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { Knex, knex } from 'knex';
import knexfile from '../../../infrastructure/entrepots/postgres/knexfile';
import { UtilisateurMAC } from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';

const l = console.log;

async function supprimeCompte(
  mailDuCompte: string,
  tousLesAidants: UtilisateurMAC[],
  connexionKnex: Knex,
  avancement: { courante: number; total: number }
): Promise<string> {
  const position = () =>
    `[${avancement.courante.toString().padStart(3)} / ${avancement.total}]`;

  const compteTrouve = tousLesAidants.find(
    (a) => a.email.toLowerCase().trim() === mailDuCompte.toLowerCase().trim()
  );

  if (!compteTrouve)
    return `${position()} 🔴 ${mailDuCompte} : aucun compte trouvé`;

  await connexionKnex.raw(`DELETE FROM "utilisateurs_mac" WHERE id = ?`, [
    compteTrouve.identifiant,
  ]);
  return `${position()} 🟢 ${mailDuCompte} : compte trouvé et supprimé`;
}

program
  .description('Supprime des comptes Aidant, via les emails associés')
  .requiredOption(
    '--emails <emailsFormatCsv>',
    'Tous les emails séparés par des virgules'
  )
  .option('--dry-run <trueOuFalse>', 'Exécute en mode dry-run', 'true')
  .action(async (options) => {
    const dryRunActif = options.dryRun !== 'false';

    const tousLesMails: string[] = options.emails
      .split(',')
      .map((mail: string) => mail.trim());

    l(
      `🗒️  Vous avez demandé la suppression de ${tousLesMails.length} compte(s) Aidant.`
    );

    if (dryRunActif) {
      l(`🧪 Le mode dry-run est actif ! On s'arrête là…`);
      process.exit(0);
    }

    l(`🚚 C'est parti…`);

    const aidants = await new EntrepotUtilisateurMACPostgres(
      adaptateurServiceChiffrement()
    ).tous();
    const connexionKnex = knex(knexfile);

    const resultatsDeSuppressions = tousLesMails.map(
      async (mail, i) =>
        await supprimeCompte(mail, aidants, connexionKnex, {
          courante: i + 1,
          total: tousLesMails.length,
        })
    );

    for (const uneSuppression of resultatsDeSuppressions) {
      const resultat = await uneSuppression;
      l(resultat);
    }

    process.exit(0);
  });

program.parse();
