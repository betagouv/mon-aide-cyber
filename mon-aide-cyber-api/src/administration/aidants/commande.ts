import { program } from 'commander';
import { EntrepotAidantPostgres } from '../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { BusEvenementMAC } from '../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../adaptateurs/fabriqueConsommateursEvenements';
import { ImportAidant, importeAidants } from './importeAidants';
import * as fs from 'fs';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")',
  );

function ligneCSV(
  aidant: ImportAidant,
  estCompteCree: string,
  commentaire: string,
  messageAvecMotDePasse: string,
) {
  return `${aidant.region};${aidant.nomPrenom};${aidant.email};${aidant.telephone};${estCompteCree};${commentaire};${messageAvecMotDePasse}\n`;
}

command.action(async (...args: any[]) => {
  const entrepot = new EntrepotAidantPostgres(adaptateurServiceChiffrement());

  const aidantsImportes = await importeAidants(
    entrepot,
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(args[0], { encoding: 'utf-8' }),
  );

  console.log('%d aidants importés ', aidantsImportes.aidantsImportes.length);

  if (aidantsImportes) {
    const rapport: string[] = [];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    rapport.push(
      `Région;nom;mail;Téléphone;Compte Créé ?;commentaires;message avec mot de passe\n`,
    );
    aidantsImportes.aidantsImportes.forEach((aidant) => {
      const commentaire = `importé le ${dateMaintenantISO}`;
      const estCompteCree = `oui`;
      const messageAvecMotDePasse = `"Bonjour,\nVotre mot de passe MonAideCyber : ${aidant.motDePasse}\nPour toute information monaidecyber@ssi.gouv.fr\nBonne journée\nL'équipe MonAideCyber"`;

      rapport.push(
        ligneCSV(aidant, estCompteCree, commentaire, messageAvecMotDePasse),
      );
    });

    aidantsImportes.aidantsExistants.forEach((aidant) => {
      const commentaire = `avait déjà été enregistré`;
      const estCompteCree = `oui`;
      const messageAvecMotDePasse = '';

      rapport.push(
        ligneCSV(aidant, estCompteCree, commentaire, messageAvecMotDePasse),
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
