import { CorpsReponse, CorpsReponseQuestionATiroir } from "./ServiceDiagnostic";
import { QuestionDiagnostic } from "./Diagnostic";

interface Strategie {
  applique(questionTrouvee: QuestionDiagnostic | undefined): void;
}

class StrategieChaineDeCaractere implements Strategie {
  constructor(private readonly reponse: string) {}

  applique(questionTrouvee: QuestionDiagnostic): void {
    questionTrouvee.reponseDonnee = {
      reponseUnique: this.reponse,
      reponsesMultiples: [],
    };
  }
}

class StrategieQuestionATiroir implements Strategie {
  constructor(private readonly reponse: CorpsReponseQuestionATiroir) {}

  applique(questionTrouvee: QuestionDiagnostic): void {
    questionTrouvee.reponseDonnee = {
      reponseUnique: this.reponse.reponse,
      reponsesMultiples: this.reponse.questions.map((q) => ({
        identifiant: q.identifiant,
        reponses: new Set(q.reponses),
      })),
    };
  }
}

class StrategieReponsesMultiples implements Strategie {
  constructor(
    private readonly identifiant: string,
    private readonly reponse: string[],
  ) {}

  applique(questionTrouvee: QuestionDiagnostic): void {
    questionTrouvee.reponseDonnee = {
      reponseUnique: null,
      reponsesMultiples: [
        {
          identifiant: this.identifiant,
          reponses: new Set(this.reponse as string[]),
        },
      ],
    };
  }
}

export const StrategieDeReponse = {
  pour: (corpsReponse: CorpsReponse): Strategie => {
    if (estChaineDeCharactere(corpsReponse.reponse)) {
      return new StrategieChaineDeCaractere(corpsReponse.reponse);
    }
    if (estReponseQuestionATiroir(corpsReponse.reponse)) {
      return new StrategieQuestionATiroir(corpsReponse.reponse);
    }
    if (estReponseMultiples(corpsReponse.reponse)) {
      return new StrategieReponsesMultiples(
        corpsReponse.identifiant,
        corpsReponse.reponse,
      );
    }
    return new (class implements Strategie {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      applique(__: QuestionDiagnostic | undefined): void {}
    })();
  },
};
const estReponseQuestionATiroir = (
  reponse: string | CorpsReponseQuestionATiroir | string[],
): reponse is CorpsReponseQuestionATiroir => {
  return (
    (reponse as CorpsReponseQuestionATiroir).reponse !== undefined &&
    (reponse as CorpsReponseQuestionATiroir).reponse !== null
  );
};
const estChaineDeCharactere = (
  reponse: string | CorpsReponseQuestionATiroir | string[],
): reponse is string => {
  return typeof reponse === "string";
};
const estReponseMultiples = (
  reponse: string | CorpsReponseQuestionATiroir | string[],
): reponse is string[] => {
  return Array.isArray(reponse);
};
