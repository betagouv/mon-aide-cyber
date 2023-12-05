import serveur from '../../src/serveur';
import { AdaptateurReferentielDeTest } from '../adaptateurs/AdaptateurReferentielDeTest';
import { AdaptateurTranscripteurDeTest } from '../adaptateurs/adaptateurTranscripteur';
import { AdaptateurTableauDeRecommandationsDeTest } from '../adaptateurs/AdaptateurTableauDeRecommandationsDeTest';
import { AdaptateurDeRestitution } from '../../src/adaptateurs/AdaptateurDeRestitution';
import {
  Diagnostic,
  RecommandationPriorisee,
} from '../../src/diagnostic/Diagnostic';
import { Express } from 'express';
import { fakerFR } from '@faker-js/faker';
import { EntrepotsMemoire } from '../../src/infrastructure/entrepots/memoire/EntrepotsMemoire';
import { BusEvenementDeTest } from '../infrastructure/bus/BusEvenementDeTest';
import { AdaptateurGestionnaireErreursMemoire } from '../../src/infrastructure/adaptateurs/AdaptateurGestionnaireErreursMemoire';
import { FauxGestionnaireDeJeton } from '../../src/infrastructure/authentification/FauxGestionnaireDeJeton';
import { AdaptateurDeVerificationDeSessionDeTest } from '../adaptateurs/AdaptateurDeVerificationDeSessionDeTest';
import { ContenuHtml } from '../../src/infrastructure/adaptateurs/AdaptateurDeRestitutionPDF';

const testeurIntegration = () => {
  let serveurDeTest: {
    app: Express;
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurReferentiel = new AdaptateurReferentielDeTest();
  const adaptateurTableauDeRecommandations =
    new AdaptateurTableauDeRecommandationsDeTest();
  const adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest();
  const entrepots = new EntrepotsMemoire();
  const busEvenement = new BusEvenementDeTest();
  const gestionnaireDeJeton = new FauxGestionnaireDeJeton();
  const adaptateurDeVerificationDeSession =
    new AdaptateurDeVerificationDeSessionDeTest();
  const adaptateurDeRestitution: AdaptateurDeRestitution = {
    genere: (__: Promise<ContenuHtml>[]) =>
      Promise.resolve(Buffer.from('genere')),
    genereAnnexes: (__: RecommandationPriorisee[]) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereRecommandations: (__: RecommandationPriorisee[] | undefined) =>
      Promise.resolve({} as unknown as ContenuHtml),
    genereRestitution: (__: Diagnostic) =>
      Promise.resolve(Buffer.from('PDF généré')),
  } as unknown as AdaptateurDeRestitution;
  const gestionnaireErreurs = new AdaptateurGestionnaireErreursMemoire();

  const initialise = () => {
    serveurDeTest = serveur.creeServeur({
      adaptateurDeRestitution,
      adaptateurReferentiel,
      adaptateurTranscripteurDonnees,
      adaptateurTableauDeRecommandations,
      entrepots,
      busEvenement,
      gestionnaireErreurs,
      gestionnaireDeJeton,
      adaptateurDeVerificationDeSession,
      avecProtectionCsrf: false,
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
    adaptateurDeRestitution,
    gestionnaireErreurs,
    adaptateurDeVerificationDeSession,
  };
};

export default testeurIntegration;
