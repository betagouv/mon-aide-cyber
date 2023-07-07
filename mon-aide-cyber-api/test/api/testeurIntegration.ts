import serveur from "../../src/serveur";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { AdaptateurTranscripteurDeTest } from "../adaptateurs/adaptateurTranscripteur";

const testeurIntegration = () => {
  let serveurDeTest: {
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurDonnees = new AdaptateurReferentielDeTest();
  const adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest();
  const initialise = () => {
    serveurDeTest = serveur.creeServeur({
      adaptateurReferentiel: adaptateurDonnees,
      adaptateurTranscripteurDonnees,
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    serveurDeTest.ecoute(1234, () => {});
  };

  const arrete = () => {
    serveurDeTest.arreteEcoute();
  };

  return {
    adaptateurDonnees,
    arrete,
    initialise,
  };
};

export default testeurIntegration;
