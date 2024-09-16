import { program } from 'commander';
import {
  EN_TETES_FICHIER_CSV,
  TraitementCreationEspaceAidant,
  initialiseCreationEspacesAidants,
} from './initialiseCreationEspacesAidants';
import * as fs from 'fs';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")'
  );

const versLigneCSV = (aidant: TraitementCreationEspaceAidant) =>
  `${aidant.region};${aidant.nomPrenom};${aidant.formation};${aidant.charte};${aidant.email};${aidant.telephone};${aidant.todo};${aidant.qui};${aidant.compteCree};${aidant.commentaires};${aidant.messageAvecMDP}\n`;

command.action(async (...args: any[]) => {
  const espacesAidantsCrees = await initialiseCreationEspacesAidants(
    fabriqueEntrepots(),
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(args[0], { encoding: 'utf-8' })
  );

  if (espacesAidantsCrees) {
    const rapport: string[] = [];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    rapport.push(`${EN_TETES_FICHIER_CSV.join(';')}\n`);
    const imports: TraitementCreationEspaceAidant[] = [
      ...espacesAidantsCrees.aidantsImportes,
      ...espacesAidantsCrees.aidantsExistants,
      ...espacesAidantsCrees.mailsCreationEspaceAidantEnvoyes,
      ...espacesAidantsCrees.mailsCreationEspaceAidantEnAttente,
    ];
    console.log(
      'Nombre d’Aidants : %d\nNombre d’aidants importés : %d, \nNombre d’aidants déjà existants : %d\nNombre de mail envoyés suite à une demande: %d\nNombre de demandes toujours en cours: %d',
      imports.length,
      espacesAidantsCrees.aidantsImportes.length,
      espacesAidantsCrees.aidantsExistants.length,
      espacesAidantsCrees.mailsCreationEspaceAidantEnvoyes.length,
      espacesAidantsCrees.mailsCreationEspaceAidantEnAttente.length
    );
    imports.forEach((aidant) => {
      rapport.push(versLigneCSV(aidant));
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