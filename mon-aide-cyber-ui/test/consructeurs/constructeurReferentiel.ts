import { faker } from "@faker-js/faker/locale/fr";
import {
  Question,
  Referentiel,
  ReponsePossible,
  TypeDeSaisie,
} from "../../src/domaine/diagnostic/Referentiel.ts";
import { Constructeur } from "./Constructeur.ts";
import { uneReponsePossible } from "./constructeurReponsePossible.ts";
import { ActionDiagnostic } from "../../src/domaine/diagnostic/Diagnostic.ts";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  private questions: Question[] = [];
  private actions: ActionDiagnostic[] = [];

  avecUneQuestionEtDesReponses(
    question: {
      libelle: string;
      type?: Exclude<TypeDeSaisie, "aCocher" | "saisieLibre">;
    },
    reponsePossibles: ReponsePossible[] = [],
  ): ConstructeurReferentiel {
    if (reponsePossibles.length === 0) {
      reponsePossibles.push(uneReponsePossible().construis());
    }
    this.questions.push({
      identifiant: faker.string.alpha(10),
      libelle: question.libelle,
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
    this.questions.push(question);
    return this;
  }
  ajouteAction(action: ActionDiagnostic): ConstructeurReferentiel {
    this.actions.push(action);
    return this;
  }

  construis(): Referentiel {
    return {
      contexte: {
        actions: this.actions,
        questions: this.questions,
      },
    };
  }
}

export const unReferentiel = () => new ConstructeurReferentiel();
