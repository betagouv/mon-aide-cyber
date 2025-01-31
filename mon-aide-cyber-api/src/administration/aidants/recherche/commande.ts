import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { EntrepotUtilisateurMACPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotUtilisateurMACPostgres';

program
  .description('Recherche les aidants')
  .option('-n, --nom <nom>', 'le nom ou partie du nom recherché')
  .option('-m, --mail <mail>', 'le mail ou partie du mail recherché')
  .action(async (options) => {
    console.log('Recherche des aidants en cours');
    const aidants = await new EntrepotUtilisateurMACPostgres(
      adaptateurServiceChiffrement()
    ).tous();

    const aidantsTrouves = aidants.filter((aidant) => {
      if (options.nom) {
        return aidant.nomPrenom
          .toLowerCase()
          .trim()
          .includes(options.nom.toLowerCase().trim());
      }
      if (options.mail) {
        return aidant.email
          .toLowerCase()
          .trim()
          .includes(options.mail.toLowerCase().trim());
      }
      return true;
    });
    console.log(
      `Il y a %s aidant(s) et %s trouvé(s)`,
      aidants.length,
      aidantsTrouves.length
    );
    console.log(JSON.stringify(aidantsTrouves, undefined, 2));
    process.exit(0);
  });

program.parse();
