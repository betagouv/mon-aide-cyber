import serveur from "./src/serveur";
import { AdaptateurDonneesMAC } from "./src/infrastructure/adaptateurs/AdaptateurDonneesMAC";
import { adaptateurTranscripteur } from "./src/infrastructure/adaptateurs/adaptateurTranscripteur";

const serveurMAC = serveur.creeServeur({
  adaptateurDonnees: new AdaptateurDonneesMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
