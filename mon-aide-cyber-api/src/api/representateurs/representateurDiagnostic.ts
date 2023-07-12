import { Diagnostic } from "../../diagnostic/Diagnostic";
import {
  QuestionChoixMultiple,
  QuestionChoixUnique,
} from "../../diagnostic/Referentiel";
import {
  Chemin,
  QuestionATranscrire,
  ReponseATranscrire,
  RepresentationDiagnostic,
  RepresentationQuestionChoixMultiple,
  RepresentationReponsePossible,
  Transcripteur,
} from "./types";

const trouveQuestionATranscrire = (
  chemin: { chemin: Chemin; identifiantQuestion: string | undefined },
  transcripteur: Transcripteur,
): QuestionATranscrire | undefined => {
  return trouveParmiLesQuestions(
    transcripteur[chemin.chemin]["questions"] as QuestionATranscrire[],
    chemin.identifiantQuestion,
  );
};
const trouveParmiLesQuestions = (
  questions: QuestionATranscrire[],
  identifiantQuestion: string | undefined,
): QuestionATranscrire | undefined => {
  for (const question of questions) {
    if (question.identifiant === identifiantQuestion) {
      return question;
    }
    const questionsATranscrire: QuestionATranscrire[] | undefined =
      question.reponses
        ?.reduce((accumulateur: ReponseATranscrire[], reponseCourante) => {
          if (reponseCourante.question !== undefined) {
            accumulateur.push(reponseCourante);
          }
          return accumulateur;
        }, [])
        .map((reponse) => reponse.question) as QuestionATranscrire[];
    if (questionsATranscrire !== undefined && questionsATranscrire.length > 0) {
      return trouveParmiLesQuestions(questionsATranscrire, identifiantQuestion);
    }
  }
  return undefined;
};
const questionTiroirATranscrire = (
  question: QuestionChoixUnique | QuestionChoixMultiple | undefined,
  transcripteur: Transcripteur,
  identifiantQuestion: string | undefined,
): RepresentationQuestionChoixMultiple | undefined => {
  if (question !== undefined) {
    const questionTiroirATranscrire: QuestionATranscrire | undefined =
      trouveQuestionATranscrire(
        {
          chemin: `contexte`,
          identifiantQuestion,
        },
        transcripteur,
      );
    if (questionTiroirATranscrire !== undefined) {
      const reponsesPossibles: RepresentationReponsePossible[] =
        trouveReponsesPossibles(
          question,
          transcripteur,
          questionTiroirATranscrire,
        );
      return {
        ...question,
        type: questionTiroirATranscrire.type,
        identifiant: questionTiroirATranscrire.identifiant,
        reponsesPossibles,
      } as RepresentationQuestionChoixMultiple;
    }
  }
  return undefined;
};

const trouveReponsesPossibles = (
  question: QuestionChoixUnique | QuestionChoixMultiple,
  transcripteur: Transcripteur,
  questionATranscrire: QuestionATranscrire | undefined,
): RepresentationReponsePossible[] => {
  return question.reponsesPossibles.map((reponse) => {
    const questionATiroirOT = questionTiroirATranscrire(
      reponse.question,
      transcripteur,
      reponse.question?.identifiant,
    );
    const reponseAtranscrire = trouveReponseATranscrire(
      reponse.identifiant,
      questionATranscrire?.reponses,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { question, ...corpsDeReponse } = reponse;
    return {
      ...corpsDeReponse,
      type: reponseAtranscrire?.type,
      question: questionATiroirOT,
    };
  });
};

const trouveReponseATranscrire = (
  identifiantReponse: string,
  reponsesATranscrire: ReponseATranscrire[] | undefined,
): ReponseATranscrire | undefined => {
  return reponsesATranscrire?.find(
    (reponseATranscrire) =>
      reponseATranscrire?.identifiant === identifiantReponse,
  );
};

export function representeLeDiagnosticPourLeClient(
  diagnostic: Diagnostic,
  transcripteur: Transcripteur,
): RepresentationDiagnostic {
  return {
    identifiant: diagnostic.identifiant,
    referentiel: {
      contexte: {
        questions: diagnostic.referentiel.contexte.questions.map((question) => {
          const questionATranscrire = trouveQuestionATranscrire(
            {
              chemin: "contexte",
              identifiantQuestion: question.identifiant,
            },
            transcripteur,
          );
          const reponsesPossibles = trouveReponsesPossibles(
            question,
            transcripteur,
            questionATranscrire,
          );
          return {
            ...question,
            reponsesPossibles,
            type: questionATranscrire?.type || question.type,
          };
        }),
      },
    },
  };
}
