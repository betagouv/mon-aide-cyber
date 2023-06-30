import { faker } from "@faker-js/faker/locale/fr";
import {
  Question,
  Referentiel,
} from "../../src/domaine/diagnostic/Referentiel.ts";

class ConstructeurReferentiel {
  private questions: Question[] = [];

  avecUneQuestion(
    question: string,
    reponsePossibles: string[],
  ): ConstructeurReferentiel {
    this.questions.push({
      identifiant: faker.string.alpha(10),
      libelle: question,
      reponsesPossibles: reponsePossibles.map((reponse, index) => ({
        ordre: index,
        libelle: reponse,
        identifiant: faker.string.alpha(10),
      })),
    });
    return this;
  }

  construis(): Referentiel {
    return {
      contexte: {
        questions: this.questions,
      },
    };
  }
}

export const unReferentiel = () => new ConstructeurReferentiel();
