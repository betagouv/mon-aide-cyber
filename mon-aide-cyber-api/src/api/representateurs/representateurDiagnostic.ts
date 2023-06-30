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

export function representeLeDiagnosticPourLeClient(
  diagnostic: Diagnostic,
): RepresentationDiagnostic {
  return {
    identifiant: diagnostic.identifiant,
    referentiel: {
      contexte: {
        questions: diagnostic.referentiel.contexte.questions.map(
          (question) => ({
            ...question,
            reponsesPossibles: question.reponsesPossibles.map((reponse) => ({
              ...reponse,
            })),
          }),
        ),
      },
    },
  };
}
