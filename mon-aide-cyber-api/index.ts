import serveur from './src/serveur';
import { AdaptateurReferentielMAC } from './src/infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { adaptateurTranscripteur } from './src/infrastructure/adaptateurs/transcripteur/adaptateurTranscripteur';
import { AdaptateurMesures } from './src/infrastructure/adaptateurs/AdaptateurMesures';
import { AdaptateurDeRestitutionPDF } from './src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';
import { fabriqueEntrepots } from './src/adaptateurs/fabriqueEntrepots';
import { BusEvenementMAC } from './src/infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from './src/adaptateurs/fabriqueConsommateursEvenements';
import { fabriqueGestionnaireErreurs } from './src/infrastructure/adaptateurs/fabriqueGestionnaireErreurs';
import { GestionnaireDeJetonJWT } from './src/infrastructure/authentification/gestionnaireDeJetonJWT';
import { AdaptateurDeVerificationDeSessionHttp } from './src/adaptateurs/AdaptateurDeVerificationDeSessionHttp';
import { AdaptateurDeRestitutionHTML } from './src/adaptateurs/AdaptateurDeRestitutionHTML';
import { BusCommandeMAC } from './src/infrastructure/bus/BusCommandeMAC';
import { fabriqueAdaptateurEnvoiMail } from './src/infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { AdaptateurDeVerificationDeCGUMAC } from './src/adaptateurs/AdaptateurDeVerificationDeCGUMAC';
import { AdaptateurDeGestionDeCookiesMAC } from './src/adaptateurs/AdaptateurDeGestionDeCookiesMAC';

const gestionnaireDeJeton = new GestionnaireDeJetonJWT(
  process.env.CLEF_SECRETE_SIGNATURE_JETONS_SESSIONS || 'clef-par-defaut',
);

const adaptateurTranscripteurDonnees = adaptateurTranscripteur();
const traductionThematiques =
  new Map(
    Object.entries(
      adaptateurTranscripteurDonnees.transcripteur().thematiques,
    ).map(([clef, thematique]) => [clef, thematique.libelle]),
  ) || new Map();

const entrepots = fabriqueEntrepots();
const busEvenementMAC = new BusEvenementMAC(fabriqueConsommateursEvenements());
const adaptateurEnvoiMessage = fabriqueAdaptateurEnvoiMail();
const serveurMAC = serveur.creeServeur({
  adaptateursRestitution: {
    pdf: () => new AdaptateurDeRestitutionPDF(traductionThematiques),
    html: () => new AdaptateurDeRestitutionHTML(traductionThematiques),
  },
  adaptateurReferentiel: new AdaptateurReferentielMAC(),
  adaptateurTranscripteurDonnees: adaptateurTranscripteurDonnees,
  adaptateurMesures: new AdaptateurMesures(),
  entrepots,
  busCommande: new BusCommandeMAC(
    entrepots,
    busEvenementMAC,
    adaptateurEnvoiMessage,
  ),
  busEvenement: busEvenementMAC,
  gestionnaireErreurs: fabriqueGestionnaireErreurs(),
  gestionnaireDeJeton: gestionnaireDeJeton,
  adaptateurDeGestionDeCookies: new AdaptateurDeGestionDeCookiesMAC(),
  adaptateurDeVerificationDeCGU: new AdaptateurDeVerificationDeCGUMAC(
    entrepots,
  ),
  adaptateurDeVerificationDeSession: new AdaptateurDeVerificationDeSessionHttp(
    gestionnaireDeJeton,
  ),
  avecProtectionCsrf: process.env.AVEC_PROTECTION_CSRF === 'true',
  adaptateurEnvoiMessage: adaptateurEnvoiMessage,
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
