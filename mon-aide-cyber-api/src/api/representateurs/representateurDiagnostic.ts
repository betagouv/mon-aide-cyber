import { Diagnostic, QuestionDiagnostic } from "../../diagnostic/Diagnostic";
import {
  QuestionATiroir,
  ReponseComplementaire,
  ReponsePossible,
} from "../../diagnostic/Referentiel";
import {
  Chemin,
  QuestionATranscrire,
  ReponseATranscrire,
  RepresentationDiagnostic,
  RepresentationQuestion,
  RepresentationReponseComplementaire,
  RepresentationReponsePossible,
  Transcripteur,
} from "./types";

const trouveQuestionATranscrire = (
  chemin: { chemin: Chemin; identifiantQuestion: string },
  transcripteur: Transcripteur,
): QuestionATranscrire | undefined => {
  return trouveParmiLesQuestions(
    transcripteur[chemin.chemin]["questions"] as QuestionATranscrire[],
    chemin.identifiantQuestion,
  );
};
const trouveParmiLesQuestions = (
  questions: QuestionATranscrire[],
  identifiantQuestion: string,
): QuestionATranscrire | undefined => {
  for (const question of questions) {
    if (question.identifiant === identifiantQuestion) {
      return question;
    }
    const questionsATranscrire = (
      question.reponses
        ?.reduce((accumulateur: ReponseATranscrire[], reponseCourante) => {
          if (reponseCourante.question !== undefined) {
            accumulateur.push(reponseCourante);
          }
          return accumulateur;
        }, [])
        .map((reponse) => reponse.question) as QuestionATranscrire[]
    )?.find((q) => q.identifiant === identifiantQuestion);
    if (questionsATranscrire !== undefined) {
      return questionsATranscrire;
    }
  }
  return undefined;
};
const questionTiroirATranscrire = (
  questions: QuestionATiroir[] | undefined,
  transcripteur: Transcripteur,
): RepresentationQuestion[] => {
  return (
    questions?.map((question) => {
      const questionTiroirATranscrire: QuestionATranscrire | undefined =
        trouveQuestionATranscrire(
          {
            chemin: `contexte`,
            identifiantQuestion: question.identifiant,
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
          type: question.type,
          identifiant: questionTiroirATranscrire.identifiant,
          reponsesPossibles,
        } as RepresentationQuestion;
      }
      return {
        ...question,
      } as RepresentationQuestion;
    }) || []
  );
};

const toutesLesReponses = (
  reponses: ReponseATranscrire[] | undefined,
): ReponseATranscrire[] => {
  return (
    reponses?.reduce((accumulateur: ReponseATranscrire[], reponseCourante) => {
      if (reponseCourante.reponses !== undefined) {
        accumulateur.push(...reponseCourante.reponses);
      }
      return accumulateur;
    }, []) || []
  );
};
const trouveReponsesComplementaires = (
  reponsesComplementaires: ReponseComplementaire[],
  transcripteur: Transcripteur,
): RepresentationReponseComplementaire[] => {
  const reponsesATranscrire = transcripteur.contexte.questions.flatMap((q) =>
    toutesLesReponses(q.reponses),
  );
  return reponsesComplementaires.map((rc) => {
    const reponseATranscrire = reponsesATranscrire.find(
      (rat) => rat.identifiant === rc.identifiant,
    );
    if (reponseATranscrire !== undefined) {
      return {
        identifiant: rc.identifiant,
        libelle: rc.libelle,
        ordre: rc.ordre,
        type: reponseATranscrire.type,
      };
    }
    return {
      identifiant: rc.identifiant,
      libelle: rc.libelle,
      ordre: rc.ordre,
    };
  });
};

const estQuestionATiroir = (
  reponse:
    | ReponsePossible
    | Omit<ReponsePossible, "questions" | "reponsesComplementaires">,
): reponse is ReponsePossible => {
  return (
    ("questions" in reponse &&
      reponse.questions !== undefined &&
      reponse.questions?.length > 0) ||
    "reponsesComplementaires" in reponse
  );
};
const trouveReponsesPossibles = (
  question: QuestionDiagnostic | QuestionATiroir,
  transcripteur: Transcripteur,
  questionATranscrire: QuestionATranscrire | undefined,
): RepresentationReponsePossible[] => {
  return question.reponsesPossibles.map((reponse) => {
    const reponseAtranscrire = trouveReponseATranscrire(
      reponse.identifiant,
      questionATranscrire?.reponses,
    );
    if (estQuestionATiroir(reponse)) {
      const representationQuestionATiroir = questionTiroirATranscrire(
        reponse.questions,
        transcripteur,
      );
      const reponsesComplementaires = trouveReponsesComplementaires(
        reponse.reponsesComplementaires || [],
        transcripteur,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { questions, ...corpsDeReponse } = reponse;
      return {
        ...corpsDeReponse,
        type: reponseAtranscrire?.type,
        question: representationQuestionATiroir[0],
        questions: representationQuestionATiroir,
        reponsesComplementaires,
      };
    }
    return {
      ...reponse,
      type: reponseAtranscrire?.type,
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

const extraisLesChampsDeLaQuestion = (question: QuestionDiagnostic) => {
  const autresReponses = {
    valeur: question.reponseDonnee.reponseUnique,
    reponsesMultiples: [...question.reponseDonnee.reponsesMultiples],
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { reponseDonnee, ...reste } = { ...question };
  return { autresReponses, reste };
};

export function representeLeDiagnosticPourLeClient(
  diagnostic: Diagnostic,
  transcripteur: Transcripteur,
): RepresentationDiagnostic {
  return {
    identifiant: diagnostic.identifiant,
    referentiel: {
      ...Object.entries(diagnostic.referentiel).reduce(
        (accumulateur, [clef, questionsThematique]) => {
          return {
            ...accumulateur,
            [clef]: {
              questions: questionsThematique.questions.map((question) => {
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
                const { autresReponses, reste } =
                  extraisLesChampsDeLaQuestion(question);
                return {
                  ...reste,
                  reponseDonnee: autresReponses,
                  reponsesPossibles,
                  type: questionATranscrire?.type || question.type,
                };
              }),
              actions: [
                {
                  action: "repondre",
                  chemin: clef,
                  ressource: {
                    url: `/api/diagnostic/${diagnostic.identifiant}`,
                    methode: "PATCH",
                  },
                },
              ],
            },
          };
        },
        {},
      ),
    },
  };
}
