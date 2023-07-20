import crypto from "crypto";
import { Question, Referentiel } from "./Referentiel";
import { Entrepot } from "../domaine/Entrepot";
import { CorpsReponse, CorpsReponseQuestionATiroir } from "./ServiceDiagnostic";

type Thematique = string;

type ReponseDonnee = {
  reponsesMultiples: Set<string>;
  reponseUnique: string | null;
};
type QuestionDiagnostic = Question & {
  reponseDonnee: ReponseDonnee;
};

type QuestionsThematique = {
  questions: QuestionDiagnostic[];
};

type ReferentielDiagnostic = {
  [clef: Thematique]: QuestionsThematique;
};

type Diagnostic = {
  identifiant: crypto.UUID;
  referentiel: ReferentielDiagnostic;
};
type EntrepotDiagnostic = Entrepot<Diagnostic>;
const initialiseDiagnostic = (r: Referentiel): Diagnostic => {
  const referentiel: {
    [clef: Thematique]: QuestionsThematique;
  } = Object.entries(r).reduce((accumulateur, [clef, questions]) => {
    return {
      ...accumulateur,
      [clef as Thematique]: {
        questions: questions.questions.map(
          (q) =>
            ({
              ...q,
              reponseDonnee: {
                reponseUnique: null,
                reponsesMultiples: new Set(),
              },
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

const ajouteLaReponseAuDiagnostic = (
  diagnostic: Diagnostic,
  corpsReponse: CorpsReponse,
) => {
  const questions = diagnostic.referentiel[corpsReponse.chemin].questions;
  const reponseCorpsReponse = corpsReponse.reponse;
  if (estChaineDeCharactere(reponseCorpsReponse)) {
    const questionTrouvee = questions.find(
      (q) => q.identifiant === corpsReponse.identifiant,
    );
    if (questionTrouvee !== undefined) {
      questionTrouvee.reponseDonnee = {
        reponseUnique: reponseCorpsReponse,
        reponsesMultiples: new Set(),
      };
    }
  }

  if (estReponseQuestionATiroir(reponseCorpsReponse)) {
    const questionTrouvee = questions.find(
      (q) => q.identifiant === corpsReponse.identifiant,
    );
    if (questionTrouvee !== undefined) {
      questionTrouvee.reponseDonnee = {
        reponseUnique: reponseCorpsReponse.reponse,
        reponsesMultiples: new Set(reponseCorpsReponse.question.reponses),
      };
    }
  }
};
const estReponseQuestionATiroir = (
  reponse: string | CorpsReponseQuestionATiroir,
): reponse is CorpsReponseQuestionATiroir => {
  return (
    (reponse as CorpsReponseQuestionATiroir).reponse !== undefined &&
    (reponse as CorpsReponseQuestionATiroir).reponse !== null
  );
};
const estChaineDeCharactere = (
  reponse: string | CorpsReponseQuestionATiroir,
): reponse is string => {
  return typeof reponse === "string";
};
export {
  Diagnostic,
  EntrepotDiagnostic,
  QuestionDiagnostic,
  ajouteLaReponseAuDiagnostic,
  initialiseDiagnostic,
};
