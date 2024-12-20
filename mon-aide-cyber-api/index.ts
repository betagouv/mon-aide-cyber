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
import { BusCommandeMAC } from './src/infrastructure/bus/BusCommandeMAC';
import { fabriqueAdaptateurEnvoiMail } from './src/infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import { AdaptateurDeVerificationDeCGUMAC } from './src/adaptateurs/AdaptateurDeVerificationDeCGUMAC';
import { AdaptateurDeGestionDeCookiesMAC } from './src/adaptateurs/AdaptateurDeGestionDeCookiesMAC';
import { AdaptateurRelationsMAC } from './src/relation/AdaptateurRelationsMAC';
import { AdaptateurDeVerificationDesAccesMAC } from './src/adaptateurs/AdaptateurDeVerificationDesAccesMAC';
import { AdaptateurDeRestitutionHTML } from './src/infrastructure/adaptateurs/AdaptateurDeRestitutionHTML';
import { adaptateurServiceChiffrement } from './src/infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { adaptateurMetabase } from './src/infrastructure/adaptateurs/adaptateurMetabase';
import { unServiceAidant } from './src/espace-aidant/ServiceAidantMAC';
import { AdaptateurDeVerificationDeTypeDeRelationMAC } from './src/adaptateurs/AdaptateurDeVerificationDeTypeDeRelationMAC';
import { adaptateurProConnect } from './src/adaptateurs/pro-connect/adaptateurProConnect';
import { adaptateurEnvironnement } from './src/adaptateurs/adaptateurEnvironnement';

const gestionnaireDeJeton = new GestionnaireDeJetonJWT(
  process.env.CLEF_SECRETE_SIGNATURE_JETONS_SESSIONS || 'clef-par-defaut'
);

const adaptateurTranscripteurDonnees = adaptateurTranscripteur();
const traductionThematiques =
  new Map(
    Object.entries(
      adaptateurTranscripteurDonnees.transcripteur().thematiques
    ).map(([clef, thematique]) => [clef, thematique.libelle])
  ) || new Map();

const entrepots = fabriqueEntrepots();
const adaptateurRelations = new AdaptateurRelationsMAC();
const busEvenementMAC = new BusEvenementMAC(
  fabriqueConsommateursEvenements(adaptateurRelations)
);
const adaptateurEnvoiMessage = fabriqueAdaptateurEnvoiMail();

const serveurMAC = serveur.creeServeur({
  adaptateurRelations: adaptateurRelations,
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
    {
      aidant: unServiceAidant(entrepots.aidants()),
      referentiels: {
        diagnostic: new AdaptateurReferentielMAC(),
        mesures: new AdaptateurMesures(),
      },
    }
  ),
  busEvenement: busEvenementMAC,
  gestionnaireErreurs: fabriqueGestionnaireErreurs(),
  gestionnaireDeJeton: gestionnaireDeJeton,
  adaptateurDeGestionDeCookies: new AdaptateurDeGestionDeCookiesMAC(),
  adaptateurDeVerificationDeCGU: new AdaptateurDeVerificationDeCGUMAC(
    entrepots
  ),
  adaptateurDeVerificationDeSession: new AdaptateurDeVerificationDeSessionHttp(
    gestionnaireDeJeton
  ),
  adaptateurDeVerificationDesAcces: new AdaptateurDeVerificationDesAccesMAC(
    adaptateurRelations
  ),
  adaptateurDeVerificationDeRelations:
    new AdaptateurDeVerificationDeTypeDeRelationMAC(adaptateurRelations),
  avecProtectionCsrf: process.env.AVEC_PROTECTION_CSRF === 'true',
  adaptateurEnvoiMessage: adaptateurEnvoiMessage,
  serviceDeChiffrement: adaptateurServiceChiffrement(),
  adaptateurMetabase: adaptateurMetabase(),
  adaptateurProConnect: adaptateurProConnect,
  estEnMaintenance: adaptateurEnvironnement.modeMaintenance().estActif(),
});

const port = process.env.PORT || 8081;
serveurMAC.ecoute(port as number, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
