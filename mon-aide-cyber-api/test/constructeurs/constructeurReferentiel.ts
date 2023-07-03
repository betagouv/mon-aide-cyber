import {
  Contexte,
  QuestionChoixUnique,
  Referentiel,
} from "../../src/diagnostique/referentiel";
import { fakerFR as faker } from "@faker-js/faker";
import { Constructeur } from "./constructeur";
import { aseptise } from "../utilitaires/aseptise";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  contexte: Contexte = { questions: [uneQuestion().construis()] };

  ajouteUneQuestionAuContexte(
    question: QuestionChoixUnique,
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

class ConstructeurQuestion implements Constructeur<QuestionChoixUnique> {
  private question: QuestionChoixUnique = {
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

  construis(): QuestionChoixUnique {
    return this.question;
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
