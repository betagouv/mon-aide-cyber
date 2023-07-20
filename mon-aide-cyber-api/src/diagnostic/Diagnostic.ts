import crypto from "crypto";
import { Question, Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";

type Thematique = string;

type ReponseDonnee = {
  valeur: string | null;
};
type QuestionDiagnostic = Question & {
  reponseDonnee: ReponseDonnee;
};

type QuestionsThematiqueDiagnostic = {
  questions: QuestionDiagnostic[];
};

type ReferentielDiagnostic = {
  [clef: Thematique]: QuestionsThematiqueDiagnostic;
};

type Diagnostic = {
  identifiant: crypto.UUID;
  referentiel: ReferentielDiagnostic;
};
type EntrepotDiagnostic = Entrepot<Diagnostic>;
const initialiseDiagnostic = (r: Referentiel): Diagnostic => {
  const referentiel: {
    [clef: Thematique]: QuestionsThematiqueDiagnostic;
  } = Object.entries(r).reduce((accumulateur, [clef, questions]) => {
    return {
      ...accumulateur,
      [clef as Thematique]: {
        questions: questions.questions.map(
          (q) =>
            ({
              ...q,
              reponseDonnee: { valeur: null },
            }) as QuestionDiagnostic,
        ),
      },
    };
  }, {});
  return {
    identifiant: crypto.randomUUID(),
    referentiel,
  };
};

export {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  initialiseDiagnostic,
};
