import { program } from 'commander';
import { ImportAidant, importeAidants } from './importeAidants';
import * as fs from 'fs';
import { EntrepotAidantPostgres } from '../../../infrastructure/entrepots/postgres/EntrepotAidantPostgres';
import { adaptateurServiceChiffrement } from '../../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")'
  );

function ligneCSV(
  aidant: ImportAidant,
  estCompteCree: string,
  commentaire: string,
  messageAvecMotDePasse: string,
  charte: string,
  todo: string,
  qui: string
) {
  return `${aidant.region};${aidant.nomPrenom};${charte};${aidant.email};${aidant.telephone};${todo};${qui};${estCompteCree};${commentaire};${messageAvecMotDePasse}\n`;
}

command.action(async (...args: any[]) => {
  const entrepot = new EntrepotAidantPostgres(adaptateurServiceChiffrement());

  const aidantsImportes = await importeAidants(
    entrepot,
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(args[0], { encoding: 'utf-8' })
  );

  console.log('%d aidants importés ', aidantsImportes.aidantsImportes.length);

  if (aidantsImportes) {
    const rapport: string[] = [];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    rapport.push(
      `Région;nom;charte;mail;Téléphone;TO DO;Qui;Compte Créé ?;commentaires;message avec mot de passe\n`
    );
    const imports: ImportAidant[] = [
      ...aidantsImportes.aidantsImportes,
      ...aidantsImportes.aidantsExistants,
    ];
    imports.forEach((aidant) => {
      rapport.push(
        ligneCSV(
          aidant,
          aidant.compteCree,
          aidant.commentaires,
          aidant.messageAvecMDP,
          aidant.charte,
          aidant.todo,
          aidant.qui
        )
      );
    });

    fs.writeFileSync(
      `/tmp/rapport-importation-aidants-${dateMaintenantISO}.csv`,
      rapport.join(''),
      {
        encoding: 'utf-8',
      }
    );
  }
  process.exit(0);
});

program.parse();
