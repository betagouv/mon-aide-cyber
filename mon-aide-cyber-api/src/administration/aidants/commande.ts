import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementChacha20 } from '../../infrastructure/securite/ServiceDeChiffrementChacha20';
import { BusEvenementMAC } from '../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../adaptateurs/fabriqueConsommateursEvenements';
import { importeAidants } from './importeAidants';
import * as fs from 'fs';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")',
  );

command.action(async (...args: any[]) => {
  const fichier: string = args[0];
  const entrepot = new EntrepotAidantPostgres(
    new ServiceDeChiffrementChacha20(),
  );

  const aidantsImportes = await importeAidants(
    entrepot,
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(fichier, { encoding: 'utf-8' }),
  );
  if (aidantsImportes) {
    const resultat: string[] = [];

    aidantsImportes.aidantsImportes.forEach((aidantImporte) => {
      resultat.push(
        `Bonjour ${aidantImporte.nomPrenom},

Je suis développeur sur MonAideCyber.
Je viens de vous créer un compte pour effectuer des diagnostics. Votre mot de passe est le suivant : "${aidantImporte.motDePasse}".

Si vous avez besoin d'informations complémentaires, vous pouvez envoyer un mail à monaidecyber@ssi.gouv.fr

Bonne journée,
L'équipe de développement MonAideCyber

`,
      );
    });
    fs.writeFileSync('/tmp/aidantsImportes', resultat.join(''), {
      encoding: 'utf-8',
    });
  }

  console.log(
    '%d aidants importés - %d aidants non importés ',
    aidantsImportes.aidantsImportes.length,
    aidantsImportes.aidantsNonImportes.length,
  );

  process.exit(0);
});

program.parse();
