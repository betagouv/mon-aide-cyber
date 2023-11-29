import serveur from './src/serveur';
import { AdaptateurReferentielMAC } from './src/infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { adaptateurTranscripteur } from './src/infrastructure/adaptateurs/adaptateurTranscripteur';
import { AdaptateurTableauDeRecommandationsMAC } from './src/infrastructure/adaptateurs/AdaptateurTableauDeRecommandationsMAC';
import { AdaptateurPDFMAC } from './src/infrastructure/adaptateurs/AdaptateurPDFMAC';
import { fabriqueEntrepots } from './src/adaptateurs/fabriqueEntrepots';
import { BusEvenementMAC } from './src/infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from './src/adaptateurs/fabriqueConsommateursEvenements';
import { fabriqueGestionnaireErreurs } from './src/infrastructure/adaptateurs/fabriqueGestionnaireErreurs';
import { GestionnaireDeJetonJWT } from './src/infrastructure/authentification/GestionnaireDeJetonJWT';
import { AdaptateurDeVerificationDeSessionHttp } from './src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { ParseurCookieSessionMAC } from './src/authentification/ParseurCookieSessionMAC';

const gestionnaireDeJeton = new GestionnaireDeJetonJWT(
  process.env.CLEF_SECRETE_SIGNATURE_JETONS_SESSIONS || 'clef-par-defaut',
);

const serveurMAC = serveur.creeServeur({
  adaptateurPDF: new AdaptateurPDFMAC(),
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteur(),
  adaptateurTableauDeRecommandations:
    new AdaptateurTableauDeRecommandationsMAC(),
  entrepots: fabriqueEntrepots(),
  busEvenement: new BusEvenementMAC(fabriqueConsommateursEvenements()),
  gestionnaireErreurs: fabriqueGestionnaireErreurs(),
  gestionnaireDeJeton: gestionnaireDeJeton,
  adaptateurDeVerificationDeSession: new AdaptateurDeVerificationDeSessionHttp(
    new ParseurCookieSessionMAC(),
    gestionnaireDeJeton,
  ),
  avecProtectionCsrf: process.env.AVEC_PROTECTION_CSRF === 'true',
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
