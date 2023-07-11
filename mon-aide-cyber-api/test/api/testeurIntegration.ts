import serveur from "../../src/serveur";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { AdaptateurTranscripteurDeTest } from "../adaptateurs/adaptateurTranscripteur";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";
import { faker } from "@faker-js/faker/locale/fr";

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
    const portAleatoire = faker.number.int({ min: 1000, max: 3000 });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    serveurDeTest.ecoute(portAleatoire, () => {});
    return portAleatoire;
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
