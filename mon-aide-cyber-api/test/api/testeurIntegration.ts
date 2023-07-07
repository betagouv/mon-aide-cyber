import serveur from "../../src/serveur";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { AdaptateurTranscripteurDeTest } from "../adaptateurs/adaptateurTranscripteur";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";

const testeurIntegration = () => {
  let serveurDeTest: {
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurReferentiel = new AdaptateurReferentielDeTest();
  const adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest();
  const entrepots = new EntrepotsMemoire();
  const initialise = () => {
    serveurDeTest = serveur.creeServeur({
      adaptateurReferentiel,
      adaptateurTranscripteurDonnees,
      entrepots,
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    serveurDeTest.ecoute(1234, () => {});
  };

  const arrete = () => {
    serveurDeTest.arreteEcoute();
  };

  return {
    adaptateurReferentiel,
    arrete,
    entrepots,
    initialise,
  };
};

export default testeurIntegration;
