import serveur from "./src/serveur";
import { AdaptateurReferentielMAC } from "./src/infrastructure/adaptateurs/AdaptateurReferentielMAC";
import { adaptateurTranscripteur } from "./src/infrastructure/adaptateurs/adaptateurTranscripteur";
import { AdaptateurTableauDeRecommandationsMAC } from "./src/infrastructure/adaptateurs/AdaptateurTableauDeRecommandationsMAC";
import { AdaptateurPDFMAC } from "./src/infrastructure/adaptateurs/AdaptateurPDFMAC";
import { fabriqueEntrepots } from "./src/adaptateurs/fabriqueEntrepots";
import { BusEvenementMAC } from "./src/infrastructure/bus/BusEvenementMAC";
import { fabriqueConsommateursEvenements } from "./src/adaptateurs/fabriqueConsommateursEvenements";
import { AdaptateurGestionnaireErreursMemoire } from "./src/infrastructure/adaptateurs/AdatpateurGestionnaireErreurs";

const serveurMAC = serveur.creeServeur({
  adaptateurPDF: new AdaptateurPDFMAC(),
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
  adaptateurTableauDeRecommandations:
    new AdaptateurTableauDeRecommandationsMAC(),
  entrepots: fabriqueEntrepots(),
  busEvenement: new BusEvenementMAC(fabriqueConsommateursEvenements()),
  gestionnaireErreurs: new AdaptateurGestionnaireErreursMemoire(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
