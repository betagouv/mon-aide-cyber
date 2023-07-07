import {
  Contexte,
  QuestionChoixMultiple,
  QuestionChoixUnique,
  Referentiel,
  ReponsePossible,
} from "../../src/diagnostique/Referentiel";
import { fakerFR as faker } from "@faker-js/faker";
import { Constructeur } from "./constructeur";
import { aseptise } from "../utilitaires/aseptise";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  contexte: Contexte = { questions: [uneQuestion().construis()] };

  ajouteUneQuestionAuContexte(
    question: QuestionChoixUnique | QuestionChoixMultiple,
  ): ConstructeurReferentiel {
    this.contexte.questions.push(question);
    return this;
  }

  construis(): Referentiel {
    return {
      contexte: this.contexte,
    };
  }
}

class ConstructeurQuestion
  implements Constructeur<QuestionChoixUnique | QuestionChoixMultiple>
{
  private question: QuestionChoixUnique | QuestionChoixMultiple = {
    type: "choixUnique",
    identifiant: faker.string.alpha(10),
    libelle: "Quelle est la réponse?",
    reponsesPossibles: [
      {
        identifiant: faker.string.alpha(10),
        libelle: faker.word.words(),
        ordre: 0,
      },
    ],
  };

  aChoixUnique(
    libelleQuestion: string,
    reponsesPossibles: { identifiant: string; libelle: string }[] = [],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = [];
    this.question.libelle = libelleQuestion;
    this.question.identifiant = aseptise(libelleQuestion);
    reponsesPossibles.forEach((reponse, index) =>
      this.question.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      }),
    );
    return this;
  }

  aChoixMultiple(
    libelleQuestion: string,
    reponsesPossibles: {
      identifiant: string;
      libelle: string;
    }[] = [],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = [];
    this.question.libelle = libelleQuestion;
    this.question.identifiant = aseptise(libelleQuestion);
    this.question.type = "choixMultiple";
    reponsesPossibles.forEach((reponse, index) =>
      this.question.reponsesPossibles.push({
        identifiant: reponse.identifiant,
        libelle: reponse.libelle,
        ordre: index,
      }),
    );
    return this;
  }

  avecReponsesPossibles(
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = reponsePossibles;
    return this;
  }

  construis(): QuestionChoixUnique | QuestionChoixMultiple {
    return this.question;
  }
}

class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private ordre: number = faker.number.int();
  private question?: QuestionChoixUnique | QuestionChoixMultiple = undefined;

  avecQuestionATiroir(
    question: QuestionChoixUnique | QuestionChoixMultiple,
  ): ConstructeurReponsePossible {
    this.question = question;
    return this;
  }

  construis(): ReponsePossible {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
      questionATiroir: this.question,
    };
  }
}

export const unReferentiel = (): ConstructeurReferentiel =>
  new ConstructeurReferentiel();

export const unReferentielAuContexteVide = (): ConstructeurReferentiel => {
  const constructeurReferentiel = new ConstructeurReferentiel();
  constructeurReferentiel.contexte.questions = [];
  return constructeurReferentiel;
};

export const uneQuestion = (): ConstructeurQuestion =>
  new ConstructeurQuestion();

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
