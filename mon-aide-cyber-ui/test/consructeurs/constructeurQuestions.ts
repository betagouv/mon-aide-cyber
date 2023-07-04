import { Constructeur } from "./Constructeur";
import { uneReponsePossible } from "./constructeurReponsePossible.ts";
import { faker } from "@faker-js/faker/locale/fr";
import {
  Question,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";

class ConstructeurQuestion implements Constructeur<Question> {
  protected identifiant = faker.string.alpha(10);
  protected libelle = faker.word.words().concat(" ?");
  protected reponsesPossibles: ReponsePossible[] = [];
  protected type?: Exclude<TypeDeSaisie, "saisieLibre"> = undefined;

  avecDesReponses(reponsePossibles: ReponsePossible[]): ConstructeurQuestion {
    this.reponsesPossibles.push(...reponsePossibles);
    return this;
  }

  avecNReponses(nombreReponses: number): ConstructeurQuestionAChoixMultiple {
    for (let i = 0; i < nombreReponses; i++) {
      this.reponsesPossibles.push(uneReponsePossible().construis());
    }
    return this;
  }

  construis(): Question {
    return {
      identifiant: this.identifiant,
      libelle: this.libelle,
      reponsesPossibles: this.reponsesPossibles,
      type: this.type,
    };
  }
}

class ConstructeurQuestionAChoixMultiple extends ConstructeurQuestion {
  constructor() {
    super();
    this.type = "choixMultiple";
  }
}

export const uneQuestionAChoixMultiple = () =>
  new ConstructeurQuestionAChoixMultiple();

export const uneQuestion = () => new ConstructeurQuestion();
