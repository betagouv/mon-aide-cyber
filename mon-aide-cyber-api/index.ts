import serveur from './src/serveur';
import { AdaptateurReferentielMAC } from './src/infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { adaptateurTranscripteur } from './src/infrastructure/adaptateurs/adaptateurTranscripteur';
import { AdaptateurTableauDeRecommandationsMAC } from './src/infrastructure/adaptateurs/AdaptateurTableauDeRecommandationsMAC';
import { AdaptateurPDFMAC } from './src/infrastructure/adaptateurs/AdaptateurPDFMAC';
import { fabriqueEntrepots } from './src/adaptateurs/fabriqueEntrepots';
import { BusEvenementMAC } from './src/infrastructure/bus/BusEvenementMAC';
import {
  ConsommateurEvenement,
  Evenement,
  TypeEvenement,
} from './src/domaine/BusEvenement';

const consommateursEvenements: Map<TypeEvenement, ConsommateurEvenement> =
  new Map([
    [
      'DIAGNOSTIC_TERMINE',
      new (class implements ConsommateurEvenement {
        consomme<E extends Evenement>(evenement: E): Promise<void> {
          console.log(`${evenement.type} : `, evenement);
          return Promise.resolve(undefined);
        }
      })(),
    ],
    [
      'DIAGNOSTIC_LANCE',
      new (class implements ConsommateurEvenement {
        consomme<E extends Evenement>(evenement: E): Promise<void> {
          console.log(`${evenement.type} :`, evenement);
          return Promise.resolve(undefined);
        }
      })(),
    ],
    [
      'REPONSE_AJOUTEE',
      new (class implements ConsommateurEvenement {
        consomme<E extends Evenement>(evenement: E): Promise<void> {
          console.log(`${evenement.type} :`, evenement);
          return Promise.resolve(undefined);
        }
      })(),
    ],
  ]);

const serveurMAC = serveur.creeServeur({
  adaptateurPDF: new AdaptateurPDFMAC(),
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
  adaptateurTableauDeRecommandations:
    new AdaptateurTableauDeRecommandationsMAC(),
  entrepots: fabriqueEntrepots(),
  busEvenement: new BusEvenementMAC(consommateursEvenements),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
