import {
  QuestionsThematique,
  QuestionATiroir,
  QuestionChoixMultiple,
  QuestionChoixUnique,
  Referentiel,
  ReponsePossible,
  TypeQuestion,
} from "../../src/diagnostic/Referentiel";
import { fakerFR as faker } from "@faker-js/faker";
import { Constructeur } from "./constructeur";
import { aseptise } from "../utilitaires/aseptise";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  thematique: { [clef: string]: QuestionsThematique } = {
    ["contexte"]: { questions: [] },
  };

  ajouteUneQuestionAuContexte(
    question: QuestionChoixUnique | QuestionChoixMultiple,
  ): ConstructeurReferentiel {
    this.thematique["contexte"].questions.push(question);
    return this;
  }

  ajouteUneThematique(
    theme: string,
    question: (QuestionChoixUnique | QuestionChoixMultiple)[],
  ): ConstructeurReferentiel {
    this.thematique[theme] = { questions: [...question] };
    return this;
  }

  sansThematique(): ConstructeurReferentiel {
    this.thematique = {};
    return this;
  }

  construis(): Referentiel {
    return Object.entries(this.thematique).reduce(
      (accumulateur, [clef, thematique]) => {
        return {
          ...accumulateur,
          [clef]: thematique,
        };
      },
      {},
    );
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
    reponsesPossibles: ReponsePossible[],
  ): ConstructeurQuestion {
    this.question.reponsesPossibles = reponsesPossibles;
    return this;
  }

  construis(): QuestionChoixUnique | QuestionChoixMultiple {
    return this.question;
  }
}

class ConstructeurListeDeQuestions
  implements Constructeur<(QuestionChoixUnique | QuestionChoixMultiple)[]>
{
  private libellesReponsesPossibles: string[][] = [];
  private labels: string[] = [];

  avecLesReponsesPossiblesSuivantes(
    libellesReponsesPossibles: string[][],
  ): ConstructeurListeDeQuestions {
    this.libellesReponsesPossibles = libellesReponsesPossibles;
    return this;
  }

  dontLesLabelsSont(labels: string[]): ConstructeurListeDeQuestions {
    this.labels = labels;
    return this;
  }

  construis(): (QuestionChoixUnique | QuestionChoixMultiple)[] {
    return this.labels.map((label, index) =>
      uneQuestion()
        .aChoixUnique(
          label,
          this.libellesReponsesPossibles[index].map((rep) =>
            uneReponsePossible().avecLibelle(rep).construis(),
          ),
        )
        .construis(),
    );
  }
}

class ConstructeurQuestionATiroir implements Constructeur<QuestionATiroir> {
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private reponsesPossibles: Omit<ReponsePossible, "questions">[] = [];
  private type: TypeQuestion = "choixUnique";

  aChoixMultiple = (libelle: string): ConstructeurQuestionATiroir => {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    this.type = "choixMultiple";
    return this;
  };

  avecReponsesPossibles = (
    reponsePossibles: ReponsePossible[],
  ): ConstructeurQuestionATiroir => {
    this.reponsesPossibles = reponsePossibles.map((reponse, index) => ({
      identifiant: reponse.identifiant,
      libelle: reponse.libelle,
      ordre: index,
    }));
    return this;
  };

  aChoixUnique = (libelle: string): ConstructeurQuestionATiroir => {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    this.type = "choixUnique";
    return this;
  };

  construis(): QuestionATiroir {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }
}
class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant: string = faker.string.alpha(10);
  private libelle: string = faker.word.words();
  private ordre: number = faker.number.int();
  private questions?: QuestionATiroir[];

  ajouteUneQuestionATiroir(
    question: QuestionATiroir,
  ): ConstructeurReponsePossible {
    if (!this.questions) {
      this.questions = [];
    }
    this.questions.push(question);
    return this;
  }

  avecLibelle(libelle: string): ConstructeurReponsePossible {
    this.libelle = libelle;
    this.identifiant = aseptise(libelle);
    return this;
  }
  construis(): ReponsePossible {
    let reponsePossible: ReponsePossible = {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
    };
    if (this.questions !== undefined) {
      reponsePossible = {
        ...reponsePossible,
        questions: this.questions,
      };
    }
    return reponsePossible;
  }
}

export const unReferentiel = (): ConstructeurReferentiel =>
  new ConstructeurReferentiel();

export const unReferentielSansThematiques = (): ConstructeurReferentiel => {
  const constructeurReferentiel = new ConstructeurReferentiel();
  constructeurReferentiel.thematique = {};
  return constructeurReferentiel;
};

export const uneQuestion = (): ConstructeurQuestion =>
  new ConstructeurQuestion();

export const uneListeDeQuestions = (): ConstructeurListeDeQuestions =>
  new ConstructeurListeDeQuestions();

export const uneQuestionATiroir = (): ConstructeurQuestionATiroir =>
  new ConstructeurQuestionATiroir();

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
