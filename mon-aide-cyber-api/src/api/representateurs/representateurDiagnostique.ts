import crypto from "crypto";
import { Diagnostique } from "../../diagnostique/diagnostique";

type DiagnostiqueOT = {
  identifiant: crypto.UUID;
  referentiel: ReferentielOT;
};
type ReponsePossibleOT = {
  type?: { type: TypeDeSaisie; format: Format } | undefined;
  identifiant: string;
  libelle: string;
  ordre: number;
};
type QuestionChoixUniqueOT = {
  reponsesPossibles: ReponsePossibleOT[];
  identifiant: string;
  libelle: string;
};
type ContexteOT = {
  questions: QuestionChoixUniqueOT[];
};
type ReferentielOT = {
  contexte: ContexteOT;
};

type TypeDeSaisie = "saisieLibre";
type Format = "nombre" | "texte";

export type Transcripteur = {
  contexte: {
    questions: [
      {
        identifiant: string;
        reponses: {
          identifiant: string;
          type?: { type: TypeDeSaisie; format: Format };
        }[];
      },
    ];
  };
};

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
            return {
              ...question,
              reponsesPossibles: question.reponsesPossibles.map((reponse) => {
                const transcription = transcripteur.contexte.questions.find(
                  (transcription) =>
                    question.identifiant === transcription.identifiant,
                );
                if (transcription !== undefined) {
                  const reponseAtranscrire = transcription.reponses.find(
                    (reponseATranscrire) =>
                      reponseATranscrire.identifiant === reponse.identifiant,
                  );
                  if (reponseAtranscrire !== undefined) {
                    return { ...reponse, type: reponseAtranscrire.type };
                  }
                }
                return { ...reponse };
              }),
            };
          },
        ),
      },
    },
  };
}
