import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import crypto from 'crypto';

program
  .description(
    'Récupère les informations des Aidants cyber par domaine (i.e : nom de domaine dans le mail "mondomaine.fr, CCI par défaut")'
  )
  .requiredOption(
    '-d, --domaine <domaine>',
    'le nom de domaine du mail sur lequel effectuer la recherche',
    'cci.fr'
  )
  .action(async (options) => {
    const nomDeDomaine = options.domaine.toLowerCase();
    console.log(
      `Recherche des aidants cyber pour le domaine ${nomDeDomaine} en cours`
    );
    const aidants = await new EntrepotAidantPostgres(
      adaptateurServiceChiffrement()
    ).tous();
    const aidantsTrouves = aidants
      .filter((aidant) => aidant.email.endsWith(nomDeDomaine))
      .map((aidant) => ({
        id: aidant.identifiant,
        idHashe: crypto
          .createHash('sha256')
          .update(aidant.identifiant)
          .digest('hex'),
        entite: aidant.entite,
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
