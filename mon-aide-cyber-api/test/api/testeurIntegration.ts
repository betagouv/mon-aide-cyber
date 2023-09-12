import serveur from "../../src/serveur";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { AdaptateurTranscripteurDeTest } from "../adaptateurs/adaptateurTranscripteur";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";
import { faker } from "@faker-js/faker/locale/fr";
import { AdaptateurTableauDeNotesDeTest } from "../adaptateurs/AdaptateurTableauDeNotesDeTest";
import { AdaptateurTableauDeRecommandationsDeTest } from "../adaptateurs/AdaptateurTableauDeRecommandationsDeTest";

const testeurIntegration = () => {
  let serveurDeTest: {
    arreteEcoute: () => void;
    ecoute: (port: number, succes: () => void) => void;
  };
  const adaptateurReferentiel = new AdaptateurReferentielDeTest();
  const adaptateurTableauDeNotes = new AdaptateurTableauDeNotesDeTest();
  const adaptateurTableauDeRecommandations =
    new AdaptateurTableauDeRecommandationsDeTest();
  const adaptateurTranscripteurDonnees = new AdaptateurTranscripteurDeTest();
  const entrepots = new EntrepotsMemoire();
  const initialise = () => {
    serveurDeTest = serveur.creeServeur({
      adaptateurReferentiel,
      adaptateurTableauDeNotes,
      adaptateurTranscripteurDonnees,
      adaptateurTableauDeRecommandations,
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
