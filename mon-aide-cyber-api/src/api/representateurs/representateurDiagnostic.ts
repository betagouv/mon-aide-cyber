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
};
type RepresentationContexte = {
  questions: RepresentationQuestionChoixUnique[];
};
type RepresentationReferentiel = {
  contexte: RepresentationContexte;
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

export function representeLeDiagnosticPourLeClient(
  diagnostic: Diagnostic,
  transcripteur: Transcripteur,
): RepresentationDiagnostic {
  return {
    identifiant: diagnostic.identifiant,
    referentiel: {
      contexte: {
        questions: diagnostic.referentiel.contexte.questions.map((question) => {
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
        }),
      },
    },
  };
}
