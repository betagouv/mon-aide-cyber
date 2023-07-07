import crypto from "crypto";
import { Diagnostique } from "../../diagnostique/Diagnostique";

type DiagnostiqueOT = {
  identifiant: crypto.UUID;
  referentiel: ReferentielOT;
};
type ReponsePossibleOT = {
  identifiant: string;
  libelle: string;
  ordre: number;
  type?: { type: TypeDeSaisie; format: Format } | undefined;
};
type QuestionChoixUniqueOT = {
  identifiant: string;
  libelle: string;
  reponsesPossibles: ReponsePossibleOT[];
  type?: TypeDeSaisie | undefined;
};
type ContexteOT = {
  questions: QuestionChoixUniqueOT[];
};
type ReferentielOT = {
  contexte: ContexteOT;
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

export function representeLeDiagnostiquePourLeClient(
  diagnostique: Diagnostique,
  transcripteur: Transcripteur,
): DiagnostiqueOT {
  return {
    identifiant: diagnostique.identifiant,
    referentiel: {
      contexte: {
        questions: diagnostique.referentiel.contexte.questions.map(
          (question) => {
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
          },
        ),
      },
    },
  };
}
