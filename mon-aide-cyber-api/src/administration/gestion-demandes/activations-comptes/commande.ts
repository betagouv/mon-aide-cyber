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
  activationsComptesAidants,
} from './activationsComptesAidants';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { BusCommandeMAC } from '../../../infrastructure/bus/BusCommandeMAC';
import { unServiceAidant } from '../../../espace-aidant/ServiceAidantMAC';
import { AdaptateurReferentielMAC } from '../../../infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { AdaptateurMesures } from '../../../infrastructure/adaptateurs/AdaptateurMesures';
import { adaptateurRechercheEntreprise } from '../../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTP } from '../../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';

const command = program
  .description('Active les comptes des Aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les aidants cyber à activer (au format csv, séparation avec ";")'
  );

const estDemandeIncomplete = (
  traitement: TraitementActivationEspaceAidant
): traitement is DemandeIncomplete =>
  !!(traitement as DemandeIncomplete).identificationDemande;

const estDemandeEnErreur = (
  traitement: TraitementActivationEspaceAidant
): traitement is DemandeEnErreur => !!(traitement as DemandeEnErreur).erreur;

const versLigneCSV = (aidant: TraitementActivationEspaceAidant) =>
  `${aidant.nom};${aidant.email};${estDemandeIncomplete(aidant) ? aidant.identificationDemande : ''};${estDemandeEnErreur(aidant) ? aidant.erreur : ''}\n`;

type TraitementActivationEspaceAidant =
  | Aidant
  | DemandeIncomplete
  | DemandeEnErreur;

command.action(async (...args: any[]) => {
  const adaptateurRelations = new AdaptateurRelationsMAC();
  const entrepots = fabriqueEntrepots();
  const busEvenementMAC = new BusEvenementMAC(
    fabriqueConsommateursEvenements()
  );
  const unAdaptateurRechercheEntreprise = adaptateurRechercheEntreprise(
    new AdaptateurDeRequeteHTTP()
  );
  const adaptateurEnvoiMessage = fabriqueAdaptateurEnvoiMail();
  const busCommandeMAC = new BusCommandeMAC(
    entrepots,
    busEvenementMAC,
    adaptateurEnvoiMessage,
    {
      aidant: unServiceAidant(entrepots.aidants()),
      referentiels: {
        diagnostic: new AdaptateurReferentielMAC(),
        mesures: new AdaptateurMesures(),
      },
    },
    unAdaptateurRechercheEntreprise,
    adaptateurRelations
  );
  const resultat = await activationsComptesAidants(
    entrepots,
    busCommandeMAC,
    fs.readFileSync(args[0], { encoding: 'utf-8' })
  );

  if (resultat) {
    const rapport: string[] = ['Nom;Email;Identifiant demande;Erreur'];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    const imports: TraitementActivationEspaceAidant[] = [
      ...resultat.demandesEnErreur,
      ...resultat.demandesIncomplete,
      ...resultat.activationsComptesAidants,
    ];
    console.log(
      'Nombre d’Aidants cyber : %d\nNombre de comptes activés suite à une demande : %d\nNombre de demandes toujours en cours : %d\nNombre de demandes en erreur : %d',
      imports.length,
      resultat.activationsComptesAidants.length,
      resultat.demandesIncomplete.length,
      resultat.demandesEnErreur.length
    );
    imports.forEach((aidant) => {
      rapport.push(versLigneCSV(aidant));
    });

    fs.writeFileSync(
      `/tmp/rapport-activation-aidants-${dateMaintenantISO}.csv`,
      rapport.join(''),
      {
        encoding: 'utf-8',
      }
    );
  }
  process.exit(0);
});

program.parse();
