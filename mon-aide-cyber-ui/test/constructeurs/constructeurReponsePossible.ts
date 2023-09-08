import { Constructeur } from "./Constructeur.ts";
import { faker } from "@faker-js/faker/locale/fr";
import {
  Format,
  QuestionATiroir,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";
import { aseptise } from "../utilitaires/aseptise.ts";

class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant = faker.string.alpha(10);
  private libelle = faker.word.words();
  private ordre = faker.number.int();
  private questions?: QuestionATiroir[];
  private type?: { type: TypeDeSaisie; format?: Format };

  avecUneQuestion(question: QuestionATiroir): ConstructeurReponsePossible {
    if (!this.questions) {
      this.questions = [];
    }
    this.questions.push(question);
    return this;
  }

  avecLibelle(libelle: string): ConstructeurReponsePossible {
    this.identifiant = aseptise(libelle);
    this.libelle = libelle;
    return this;
  }

  auFormatTexteDeSaisieLibre(): ConstructeurReponsePossible {
    this.type = { type: "saisieLibre", format: "texte" };
    return this;
  }

  enPosition(ordre: number): ConstructeurReponsePossible {
    this.ordre = ordre;
    return this;
  }
  construis(): ReponsePossible {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
      ...(this.type && { type: this.type }),
      ...(this.questions && { questions: this.questions }),
    };
  }
}

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
