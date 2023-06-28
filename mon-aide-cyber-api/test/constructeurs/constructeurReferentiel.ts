import { Referentiel } from "../../src/diagnostic/Referentiel";
import { fakerFR as faker } from "@faker-js/faker";

class ConstructeurReferentiel {
  construis(): Referentiel {
    return {
      contexte: {
        questions: [
          {
            identifiant: faker.string.alpha(10),
            libelle: faker.lorem.sentence(),
            reponsesPossibles: [
              {
                identifiant: faker.string.alpha(10),
                libelle: faker.lorem.sentence(),
                ordre: 0,
              },
            ],
          },
        ],
      },
    };
  }
}

export const unReferentiel = (): ConstructeurReferentiel =>
  new ConstructeurReferentiel();
