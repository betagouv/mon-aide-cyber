import { Diagnostic } from "./Diagnostic";
import { Note } from "./TableauDeNotes";

export type NotesDiagnostic = {
  [thematique: string]: { identifiant: string; note: Note }[];
};

export class MoteurDeNote {
  public static genereLesNotes = (diagnostic: Diagnostic): NotesDiagnostic => {
    return Object.entries(diagnostic.referentiel).reduce(
      (reducteur, [thematique, questions]) => {
        const noteThematique = questions.questions
          .filter((q) => q.reponseDonnee.reponseUnique != null)
          .map((q) => {
            return {
              identifiant: q.identifiant,
              note: q.reponsesPossibles.find(
                (rep) => rep.identifiant === q.reponseDonnee.reponseUnique,
              )?.resultat?.note,
            };
          });
        return { ...reducteur, [thematique]: noteThematique };
      },
      {},
    );
  };
}
