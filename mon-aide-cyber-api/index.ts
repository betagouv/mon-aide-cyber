import serveur from "./src/serveur";
import { AdaptateurDonneesMAC } from "./src/infrastructure/adaptateurs/AdaptateurDonneesMAC";

const serveurMAC = serveur.creeServeur({
  adaptateurDonnees: new AdaptateurDonneesMAC(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
