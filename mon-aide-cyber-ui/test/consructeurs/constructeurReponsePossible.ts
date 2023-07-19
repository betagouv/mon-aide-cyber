import { Constructeur } from "./Constructeur.ts";
import { faker } from "@faker-js/faker/locale/fr";
import {
  Format,
  Question,
  ReponseComplementaire,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";
import { aseptise } from "../utilitaires/aseptise.ts";

class ConstructeurReponsePossible implements Constructeur<ReponsePossible> {
  private identifiant = faker.string.alpha(10);
  private libelle = faker.word.words();
  private ordre = faker.number.int();
  private question?: Question = undefined;
  private type?: { type: TypeDeSaisie; format?: Format } = undefined;
  private reponsesComplementaires?: ReponseComplementaire[] = undefined;

  avecUneQuestion(question: Question): ConstructeurReponsePossible {
    this.question = question;
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
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      ordre: this.ordre,
      question: this.question,
      type: this.type,
      reponsesComplementaires: this.reponsesComplementaires,
    };
  }
}

export const uneReponsePossible = (): ConstructeurReponsePossible =>
  new ConstructeurReponsePossible();
