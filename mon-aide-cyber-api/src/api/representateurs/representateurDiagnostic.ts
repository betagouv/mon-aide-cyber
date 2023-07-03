import crypto from "crypto";
import { Diagnostic } from "../../diagnostic/Diagnostic";

type RepresentationDiagnostic = {
  identifiant: crypto.UUID;
  referentiel: RepresentationReferentiel;
};
type RepresentationReponsePossible = {
  identifiant: string;
  libelle: string;
  ordre: number;
  type?: { type: TypeDeSaisie; format: Format } | undefined;
};
type RepresentationQuestionChoixUnique = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: RepresentationReponsePossible[];
  type?: TypeDeSaisie | undefined;
};
type RepresentationContexte = {
  questions: RepresentationQuestionChoixUnique[];
};
type RepresentationReferentiel = {
  contexte: RepresentationContexte;
};

type TypeDeSaisie = "liste" | "saisieLibre";
type Format = "nombre" | "texte";

type ReponseATranscrire = {
  identifiant: string;
  type?: { format: Format; type: TypeDeSaisie };
};
type QuestionATrancrire = {
  identifiant: string;
  reponses?: ReponseATranscrire[];
  type?: TypeDeSaisie;
};
export type Transcripteur = {
  contexte: {
    questions: QuestionATrancrire[];
  };
};

const trouveQuestionATranscrire = (
  identifiantQuestion: string,
  transcripteur: Transcripteur,
): QuestionATrancrire | undefined => {
  return transcripteur.contexte.questions.find(
    (question) => identifiantQuestion === question.identifiant,
  );
};

function trouveReponseATranscrire(
  identifiantReponse: string,
  questionATranscrire: ReponseATranscrire[] | undefined,
): ReponseATranscrire | undefined {
  return questionATranscrire?.find(
    (reponseATranscrire) =>
      reponseATranscrire?.identifiant === identifiantReponse,
  );
}

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
            question.identifiant,
            transcripteur,
          );
          return {
            ...question,
            reponsesPossibles: question.reponsesPossibles.map((reponse) => {
              const reponseAtranscrire = trouveReponseATranscrire(
                reponse.identifiant,
                questionATranscrire?.reponses,
              );
              return { ...reponse, type: reponseAtranscrire?.type };
            }),
            type: questionATranscrire?.type,
          };
        }),
      },
    },
  };
}
