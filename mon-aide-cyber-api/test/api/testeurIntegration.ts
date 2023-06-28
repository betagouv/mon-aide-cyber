import serveur from "../../src/serveur";
import { AdaptateurDonneesDeTest } from "../adaptateurs/AdaptateurDonneesDeTest";

const testeurIntegration = () => {
  let serveurDeTest: {
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurDonnees = new AdaptateurDonneesDeTest();
  const initialise = () => {
    serveurDeTest = serveur.creeServeur({ adaptateurDonnees });
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
