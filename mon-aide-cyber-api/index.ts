import serveur from "./src/serveur";
import { AdaptateurReferentielMAC } from "./src/infrastructure/adaptateurs/AdaptateurReferentielMAC";
import { adaptateurTranscripteur } from "./src/infrastructure/adaptateurs/adaptateurTranscripteur";
import { EntrepotsMemoire } from "./src/infrastructure/entrepots/memoire/Entrepots";
import { AdaptateurTableauDeNotesMAC } from "./src/infrastructure/adaptateurs/AdaptateurTableauDeNotesMAC";
import { AdaptateurTableauDeRecommandationsMAC } from "./src/infrastructure/adaptateurs/AdaptateurTableauDeRecommandationsMAC";

const serveurMAC = serveur.creeServeur({
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTableauDeNotes: new AdaptateurTableauDeNotesMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
  adaptateurTableauDeRecommandations:
    new AdaptateurTableauDeRecommandationsMAC(),
  entrepots: new EntrepotsMemoire(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
