import { faker } from "@faker-js/faker/locale/fr";
import {
  Question,
  Referentiel,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";
import { Constructeur } from "./Constructeur.ts";
import { uneReponsePossible } from "./constructeurReponsePossible.ts";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  private thematique: {
    [clef: string]: {
      questions: Question[];
    };
  } = {
    ["contexte"]: {
      questions: [],
    },
  };

  avecUneQuestionEtDesReponses(
    question: {
      libelle: string;
      type: Exclude<TypeDeSaisie, "aCocher" | "saisieLibre">;
    },
    reponsePossibles: ReponsePossible[] = [],
  ): ConstructeurReferentiel {
    if (reponsePossibles.length === 0) {
      reponsePossibles.push(uneReponsePossible().construis());
    }
    this.thematique["contexte"].questions.push({
      identifiant: faker.string.alpha(10),
      libelle: question.libelle,
      reponseDonnee: { valeur: null, reponses: [] },
      reponsesPossibles: reponsePossibles.map((reponse, index) => ({
        ordre: reponse.ordre !== undefined ? reponse.ordre : index,
        libelle: reponse.libelle,
        identifiant: faker.string.alpha(10),
        type: reponse.type,
      })),
      type: question.type,
    });
    return this;
  }

  avecUneQuestion(question: Question): ConstructeurReferentiel {
    this.thematique["contexte"].questions.push(question);
    return this;
  }
  ajouteUneThematique(
    theme: string,
    questions: Question[],
  ): ConstructeurReferentiel {
    this.thematique[theme] = { questions };
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

export const unReferentiel = () => new ConstructeurReferentiel();
