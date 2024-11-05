import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import crypto from 'crypto';

program
  .description('Récupère les informations des Aidants CCI')
  .action(async () => {
    console.log('Recherche des aidants CCI en cours');
    const aidants = await new EntrepotAidantPostgres(
      adaptateurServiceChiffrement()
    ).tous();
    const aidantsTrouves = aidants
      .filter((aidant) => aidant.email.endsWith('cci.fr'))
      .map((aidant) => ({
        id: aidant.identifiant,
        idHashe: crypto
          .createHash('sha256')
          .update(aidant.identifiant)
          .digest('hex'),
        email: aidant.email,
      }));
    console.log(
      `Il y a %s aidant(s) et %s trouvé(s)`,
      aidants.length,
      aidantsTrouves.length
    );
    console.log(JSON.stringify(aidantsTrouves, undefined, 2));
    process.exit(0);
  });

program.parse();
