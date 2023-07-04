import {
  Format,
  Question,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostique/Referentiel.ts";
import { Constructeur } from "./Constructeur.ts";
import { faker } from "@faker-js/faker/locale/fr";

class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant = faker.string.alpha(10);
  private libelle = faker.word.words();
  private ordre = faker.number.int();
  private question?: Question = undefined;
  private type?: { type: TypeDeSaisie; format?: Format } = undefined;

  avecUneQuestion(question: Question): ConstructeurReponsePossible {
    this.question = question;
    return this;
  }

  avecLibelle(libelle: string): ConstructeurReponsePossible {
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
      question: this.question,
      type: this.type,
    };
  }
}

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
