import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

program
  .description('Recherche les aidants')
  .option('-n, --nom <nom>', 'le nom ou partie du nom recherché')
  .action(async (options) => {
    console.log('Recherche des aidants en cours');
    const aidants = await new EntrepotAidantPostgres(adaptateurServiceChiffrement()).tous();
    const aidantsTrouves = aidants
      .map((aidant) => ({
        id: aidant.identifiant,
        nomPrenom: aidant.nomPrenom,
        email: aidant.identifiantConnexion,
      }))
      .filter((aidant) =>
        options.nom ? aidant.nomPrenom.toLowerCase().trim().includes(options.nom.toLowerCase().trim()) : true,
      );
    console.log(`Il y a %s aidant(s) et %s trouvé(s)`, aidants.length, aidantsTrouves.length);
    console.log(JSON.stringify(aidantsTrouves, undefined, 2));
    process.exit(0);
  });

program.parse();
