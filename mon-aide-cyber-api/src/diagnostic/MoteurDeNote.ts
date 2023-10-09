import { Diagnostic, QuestionDiagnostic } from "./Diagnostic";
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
          .flatMap((q) => {
            if (q.reponseDonnee.reponsesMultiples.length > 0) {
              return this.genereLesNotesPourReponsesMultiples(q);
            }
            return [
              {
                identifiant: q.identifiant,
                note: q.reponsesPossibles.find(
                  (rep) => rep.identifiant === q.reponseDonnee.reponseUnique,
                )?.resultat?.note,
              },
            ];
          });
        return { ...reducteur, [thematique]: noteThematique };
      },
      {},
    );
  };

  private static genereLesNotesPourReponsesMultiples(
    question: QuestionDiagnostic,
  ) {
    return question.reponseDonnee.reponsesMultiples
      .flatMap((reponsesMultiples) =>
        question.reponsesPossibles
          .flatMap(
            (rep) =>
              rep.questions?.filter(
                (q) => q.identifiant === reponsesMultiples.identifiant,
              ) || [],
          )
          .flatMap((questionATiroir) => {
            return questionATiroir.reponsesPossibles
              .filter((reponse) =>
                reponsesMultiples.reponses.has(reponse.identifiant),
              )
              .flatMap((rep) => ({
                identifiant: reponsesMultiples.identifiant,
                note: rep.resultat?.note,
              }));
          }),
      )
      .flatMap((questionDiagnostic) => questionDiagnostic);
  }
}
