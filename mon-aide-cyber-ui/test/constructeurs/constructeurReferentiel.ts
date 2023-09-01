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
import { uneAction } from "./constructeurActionDiagnostic.ts";

class ConstructeurReferentiel implements Constructeur<Referentiel> {
  private thematique: {
    [clef: string]: { questions: Question[]; actions: ActionDiagnostic[] };
  } = {
    ["contexte"]: {
      questions: [],
      actions: [uneAction().contexte().construis()],
    },
  };

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
    this.thematique["contexte"].questions.push({
      identifiant: faker.string.alpha(10),
      libelle: question.libelle,
      reponseDonnee: { valeur: null, reponsesMultiples: new Set() },
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

  ajouteAction(action: ActionDiagnostic): ConstructeurReferentiel {
    this.thematique["contexte"].actions.push(action);
    return this;
  }

  sansAction(): ConstructeurReferentiel {
    this.thematique["contexte"].actions = [];
    return this;
  }

  ajouteUneThematique(
    theme: string,
    questions: Question[],
  ): ConstructeurReferentiel {
    this.thematique[theme] = { questions, actions: [] };
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
