import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { ServiceDeChiffrementChacha20 } from '../../infrastructure/securite/ServiceDeChiffrementChacha20';
import { BusEvenementMAC } from '../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../adaptateurs/fabriqueConsommateursEvenements';
import { importeAidants } from './importeAidants';
import * as fs from 'fs';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")',
  );

command.action(async (...args: any[]) => {
  const entrepot = new EntrepotAidantPostgres(
    new ServiceDeChiffrementChacha20(),
  );

  const aidantsImportes = await importeAidants(
    entrepot,
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(args[0], { encoding: 'utf-8' }),
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

  if (aidantsImportes) {
    const rapport: string[] = [];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    rapport.push(
      `Région;nom;charte;mail;Téléphone;Compte Créé ?;commentaires;message avec mot de passe\n`,
    );
    aidantsImportes.aidantsImportes.forEach((aidantImporte) => {
      const commentaire = `importé le ${dateMaintenantISO}`;
      const estCompteCree = `oui`;
      const messageAvecMotDePasse = `"Bonjour,\nVotre mot de passe MonAideCyber : ${aidantImporte.motDePasse}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`;
      const statusCharte = aidantImporte.charteSignee ? 'OK' : 'A demander';

      rapport.push(
        `${aidantImporte.region};${aidantImporte.nomPrenom};${statusCharte};${aidantImporte.email};${aidantImporte.telephone};${estCompteCree};${commentaire};${messageAvecMotDePasse}\n`,
      );
    });

    aidantsImportes.aidantsNonImportes.forEach((aidantNonImporte) => {
      const commentaire = `tentative d'import le ${dateMaintenantISO}`;
      const estCompteCree = `non`;
      const messageAvecMotDePasse = '';
      const statusCharte = aidantNonImporte.charteSignee ? 'OK' : 'A demander';

      rapport.push(
        `${aidantNonImporte.region};${aidantNonImporte.nomPrenom};${statusCharte};${aidantNonImporte.email};${aidantNonImporte.telephone};${estCompteCree};${commentaire};${messageAvecMotDePasse}\n`,
      );
    });

    aidantsImportes.aidantsExistants.forEach((aidantExistant) => {
      const commentaire = `avait déjà été enregistré`;
      const estCompteCree = `oui`;
      const messageAvecMotDePasse = '';
      const statusCharte = 'OK';

      rapport.push(
        `${aidantExistant.region};${aidantExistant.nomPrenom};${statusCharte};${aidantExistant.email};${aidantExistant.telephone};${estCompteCree};${commentaire};${messageAvecMotDePasse}\n`,
      );
    });

    fs.writeFileSync(
      `/tmp/rapport-importation-aidants-${dateMaintenantISO}.csv`,
      rapport.join(''),
      {
        encoding: 'utf-8',
      },
    );
  }
  process.exit(0);
});

program.parse();
