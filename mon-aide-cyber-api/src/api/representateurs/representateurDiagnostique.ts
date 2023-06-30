import crypto from "crypto";
import { Diagnostique } from "../../diagnostique/diagnostique";

type DiagnostiqueOT = {
  identifiant: crypto.UUID;
  referentiel: ReferentielOT;
};
type ReponsePossibleOT = {
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

export function representeLeDiagnostiquePourLeClient(
  diagnostique: Diagnostique,
): DiagnostiqueOT {
  return {
    identifiant: diagnostique.identifiant,
    referentiel: {
      contexte: {
        questions: diagnostique.referentiel.contexte.questions.map(
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
