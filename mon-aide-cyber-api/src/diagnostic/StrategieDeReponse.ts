import {
  CorpsReponse,
  CorpsReponseLibre,
  CorpsReponseQuestionATiroir,
} from './ServiceDiagnostic';
import { QuestionDiagnostic } from './Diagnostic';

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

class StrategieReponseLibre implements Strategie {
  constructor(private readonly reponse: CorpsReponseLibre) {}

  applique(questionTrouvee: QuestionDiagnostic): void {
    questionTrouvee.reponseDonnee = {
      reponseUnique: {
        identifiant: this.reponse.identifiant,
        reponse: this.reponse.valeur,
      },
      reponsesMultiples: [],
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
    if (estReponseLibre(corpsReponse.reponse)) {
      return new StrategieReponseLibre(corpsReponse.reponse);
    }
    return new StrategieReponsesMultiples(
      corpsReponse.identifiant,
      corpsReponse.reponse,
    );
  },
};
const estReponseQuestionATiroir = (
  reponse: string | CorpsReponseQuestionATiroir | CorpsReponseLibre | string[],
): reponse is CorpsReponseQuestionATiroir => {
  return (
    (reponse as CorpsReponseQuestionATiroir).reponse !== undefined &&
    (reponse as CorpsReponseQuestionATiroir).reponse !== null
  );
};

const estReponseLibre = (
  reponse: string | CorpsReponseQuestionATiroir | CorpsReponseLibre | string[],
): reponse is CorpsReponseLibre => {
  return (
    (reponse as CorpsReponseLibre).valeur !== undefined &&
    (reponse as CorpsReponseLibre).valeur !== null &&
    (reponse as CorpsReponseLibre).identifiant !== undefined &&
    (reponse as CorpsReponseLibre).identifiant !== null
  );
};

const estChaineDeCharactere = (
  reponse: string | CorpsReponseQuestionATiroir | CorpsReponseLibre | string[],
): reponse is string => {
  return typeof reponse === 'string';
};
