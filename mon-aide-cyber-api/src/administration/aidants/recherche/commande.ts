import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { EntrepotUtilisateurMACPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotUtilisateurMACPostgres';

program
  .description('Recherche les aidants')
  .option('-n, --nom <nom>', 'le nom ou partie du nom recherché')
  .action(async (options) => {
    console.log('Recherche des aidants en cours');
    const aidants = await new EntrepotUtilisateurMACPostgres(
      adaptateurServiceChiffrement()
    ).tous();
    const aidantsTrouves = aidants
      .map((aidant) => ({
        id: aidant.identifiant,
        nomPrenom: aidant.nomPrenom,
        email: aidant.email,
      }))
      .filter((aidant) =>
        options.nom
          ? aidant.nomPrenom
              .toLowerCase()
              .trim()
              .includes(options.nom.toLowerCase().trim())
          : true
      );
    console.log(
      `Il y a %s aidant(s) et %s trouvé(s)`,
      aidants.length,
      aidantsTrouves.length
    );
    console.log(JSON.stringify(aidantsTrouves, undefined, 2));
    process.exit(0);
  });

program.parse();
