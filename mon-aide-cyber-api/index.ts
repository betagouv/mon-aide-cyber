import serveur from "./src/serveur";
import { AdaptateurReferentielMAC } from "./src/infrastructure/adaptateurs/AdaptateurReferentielMAC";
import { adaptateurTranscripteur } from "./src/infrastructure/adaptateurs/adaptateurTranscripteur";
import { EntrepotsMemoire } from "./src/infrastructure/entrepots/memoire/Entrepots";
import { AdaptateurTableauDeRecommandationsMAC } from "./src/infrastructure/adaptateurs/AdaptateurTableauDeRecommandationsMAC";
import { AdaptateurPDFMAC } from "./src/infrastructure/adaptateurs/AdaptateurPDFMAC";

const serveurMAC = serveur.creeServeur({
  adaptateurPDF: new AdaptateurPDFMAC(),
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
  adaptateurTableauDeRecommandations:
    new AdaptateurTableauDeRecommandationsMAC(),
  entrepots: new EntrepotsMemoire(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
