import serveur from "./src/serveur";
import { AdaptateurReferentielMAC } from "./src/infrastructure/adaptateurs/AdaptateurReferentielMAC";
import { adaptateurTranscripteur } from "./src/infrastructure/adaptateurs/adaptateurTranscripteur";

const serveurMAC = serveur.creeServeur({
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
