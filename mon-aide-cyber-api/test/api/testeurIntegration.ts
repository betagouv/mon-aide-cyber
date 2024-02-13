import serveur from '../../src/serveur';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurTranscripteurDeTest } from '../adaptateurs/adaptateurTranscripteur';
import { AdaptateurMesuresTest } from '../adaptateurs/AdaptateurMesuresTest';
import { Express } from 'express';
import { fakerFR } from '@faker-js/faker';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurGestionnaireErreursMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurGestionnaireErreursMemoire';
import { FauxGestionnaireDeJeton } from '../infrastructure/authentification/FauxGestionnaireDeJeton';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';
import { unAdaptateurDeRestitutionHTML } from '../adaptateurs/ConstructeurAdaptateurRestitutionHTML';
import { AdaptateursRestitution } from '../../src/adaptateurs/AdaptateursRestitution';
import { unAdaptateurRestitutionPDF } from '../adaptateurs/ConstructeurAdaptateurRestitutionPDF';
import { BusCommandeMAC } from '../../src/infrastructure/bus/BusCommandeMAC';
import { AdaptateurEnvoiMail } from '../../src/adaptateurs/AdaptateurEnvoiMail';
import { AdaptateurEnvoiMailMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurEnvoiMailMemoire';

import { AdapatateurDeVerificationDeCGUDeTest } from '../adaptateurs/AdaptateurDeVerificationDeCGUDeTest';

const testeurIntegration = () => {
  let serveurDeTest: {
    app: Express;
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurReferentiel = new AdaptateurReferentielDeTest();
  const adaptateurMesures = new AdaptateurMesuresTest();
  const adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest();
  const entrepots = new EntrepotsMemoire();
  const busEvenement = new BusEvenementDeTest();
  const gestionnaireDeJeton = new FauxGestionnaireDeJeton();
  const adaptateurDeVerificationDeCGU =
    new AdapatateurDeVerificationDeCGUDeTest();
  const adaptateurDeVerificationDeSession =
    new AdaptateurDeVerificationDeSessionDeTest();
  const gestionnaireErreurs = new AdaptateurGestionnaireErreursMemoire();
  const adaptateurEnvoieMessage: AdaptateurEnvoiMail =
    new AdaptateurEnvoiMailMemoire();

  const adaptateursRestitution: AdaptateursRestitution = {
    html() {
      return unAdaptateurDeRestitutionHTML().construis();
    },

    pdf() {
      return unAdaptateurRestitutionPDF();
    },
  };

  const initialise = () => {
    serveurDeTest = serveur.creeServeur({
      adaptateurReferentiel,
      adaptateurTranscripteurDonnees,
      adaptateurMesures,
      entrepots,
      busCommande: new BusCommandeMAC(entrepots, busEvenement),
      busEvenement,
      gestionnaireErreurs,
      gestionnaireDeJeton,
      adaptateurDeVerificationDeCGU,
      adaptateurDeVerificationDeSession,
      adaptateursRestitution,
      avecProtectionCsrf: false,
      adaptateurEnvoiMessage: adaptateurEnvoieMessage,
    });
    const portEcoute = fakerFR.number.int({ min: 10000, max: 20000 });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    serveurDeTest.ecoute(portEcoute, () => {});
    return { portEcoute: portEcoute, app: serveurDeTest.app };
  };

  const arrete = () => {
    serveurDeTest.arreteEcoute();
  };

  return {
    adaptateurReferentiel,
    arrete,
    entrepots,
    initialise,
    gestionnaireErreurs,
    adaptateurDeVerificationDeCGU,
    adaptateurDeVerificationDeSession,
    adaptateursRestitution,
    adaptateurEnvoieMessage,
  };
};

export default testeurIntegration;
