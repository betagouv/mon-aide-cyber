import { Constructeur } from "./Constructeur.ts";
import { faker } from "@faker-js/faker/locale/fr";
import {
  Format,
  QuestionATiroir,
  ReponseComplementaire,
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
  private reponsesComplementaires?: ReponseComplementaire[];

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

  avecReponsesComplementaires(
    reponsesComplementaires: ReponseComplementaire[],
  ): ConstructeurReponsePossible {
    this.reponsesComplementaires = reponsesComplementaires;
    return this;
  }

  construis(): ReponsePossible {
    let reponsePossible: ReponsePossible = {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
    };
    if (this.type) {
      reponsePossible = { ...reponsePossible, type: this.type };
    }
    if (this.reponsesComplementaires) {
      reponsePossible = {
        ...reponsePossible,
        reponsesComplementaires: this.reponsesComplementaires,
      };
    }
    if (this.questions) {
      reponsePossible = { ...reponsePossible, questions: this.questions };
    }
    return reponsePossible;
  }
}

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
