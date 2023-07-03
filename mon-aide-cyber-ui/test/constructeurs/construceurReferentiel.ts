import { faker } from "@faker-js/faker/locale/fr";
import {
  Format,
  Question,
  Referentiel,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";

type ReponsePossible = {
  libelle: string;
  type?: { type: TypeDeSaisie; format: Format } | undefined;
};

class ConstructeurReponsePossibles {
  private libelle = faker.word.words();

  construis(): ReponsePossible {
    return {
      libelle: this.libelle,
    };
  }
}

const uneReponsePossible = () => new ConstructeurReponsePossibles();

class ConstructeurReferentiel {
  private questions: Question[] = [];

  avecUneQuestion(
    question: { libelle: string; type?: TypeDeSaisie },
    reponsePossibles: ReponsePossible[] = [],
  ): ConstructeurReferentiel {
    if (reponsePossibles.length === 0) {
      reponsePossibles.push(uneReponsePossible().construis());
    }
    this.questions.push({
      identifiant: faker.string.alpha(10),
      libelle: question.libelle,
      reponsesPossibles: reponsePossibles.map((reponse, index) => ({
        ordre: index,
        libelle: reponse.libelle,
        identifiant: faker.string.alpha(10),
        type: reponse.type,
      })),
      type: question.type,
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
