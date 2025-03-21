import { program } from 'commander';
import * as fs from 'fs';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import {
  Aidant,
  DemandeEnErreur,
  DemandeIncomplete,
  validationCompteAidant,
} from './validationCompteAidant';

const command = program
  .description('Importe des aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants à importer (au format csv, séparation avec ";")'
  );

const estDemandeIncomplete = (
  traitement: TraitementCreationEspaceAidant
): traitement is DemandeIncomplete =>
  !!(traitement as DemandeIncomplete).identificationDemande;

const estDemandeEnErreur = (
  traitement: TraitementCreationEspaceAidant
): traitement is DemandeEnErreur => !!(traitement as DemandeEnErreur).erreur;

const versLigneCSV = (aidant: TraitementCreationEspaceAidant) =>
  `${aidant.nom};${aidant.email};${estDemandeIncomplete(aidant) ? aidant.identificationDemande : ''};${estDemandeEnErreur(aidant) ? aidant.erreur : ''}\n`;

type TraitementCreationEspaceAidant =
  | Aidant
  | DemandeIncomplete
  | DemandeEnErreur;

command.action(async (...args: any[]) => {
  const resultat = await validationCompteAidant(
    fabriqueEntrepots(),
    new BusEvenementMAC(fabriqueConsommateursEvenements()),
    fs.readFileSync(args[0], { encoding: 'utf-8' })
  );

  if (resultat) {
    const rapport: string[] = ['Nom;Email;Identifiant demande;Erreur'];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    const imports: TraitementCreationEspaceAidant[] = [
      ...resultat.demandesEnErreur,
      ...resultat.demandesIncomplete,
      ...resultat.envoisMailCreationEspaceAidant,
    ];
    console.log(
      'Nombre d’Aidants : %d\nNombre de mail envoyés suite à une demande : %d\nNombre de demandes toujours en cours : %d\nNombre de demandes en erreur : %d',
      imports.length,
      resultat.envoisMailCreationEspaceAidant.length,
      resultat.demandesIncomplete.length,
      resultat.demandesEnErreur.length
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
