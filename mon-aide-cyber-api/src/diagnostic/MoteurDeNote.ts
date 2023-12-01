import { Diagnostic, QuestionDiagnostic } from './Diagnostic';
import { Note } from './Note';

export type NotesDiagnostic = {
  [thematique: string]: { identifiant: string; note: Note }[];
};

export class MoteurDeNote {
  public static genereLesNotes = (diagnostic: Diagnostic): NotesDiagnostic => {
    return Object.entries(diagnostic.referentiel).reduce(
      (reducteur, [thematique, questions]) => ({
        ...reducteur,
        [thematique]: questions.questions
          .filter((question) => question.reponseDonnee.reponseUnique != null)
          .flatMap((question) => [
            ...this.genereLesNotesPourReponseUnique(question),
            ...this.genereLesNotesPourReponsesMultiples(question),
          ]),
      }),
      {},
    );
  };

  private static genereLesNotesPourReponseUnique(
    question: QuestionDiagnostic,
  ): { identifiant: string; note: Note }[] {
    return question.reponsesPossibles
      .filter(
        (reponsePossible) =>
          reponsePossible.identifiant === question.reponseDonnee.reponseUnique,
      )
      ?.filter(
        (reponsePossible) => reponsePossible.resultat?.note !== undefined,
      )
      .flatMap((reponsePossible) => ({
        identifiant: question.identifiant,
        note: reponsePossible.resultat?.note,
      }));
  }

  private static genereLesNotesPourReponsesMultiples(
    question: QuestionDiagnostic,
  ): { identifiant: string; note: Note }[] {
    return question.reponseDonnee.reponsesMultiples
      .flatMap((reponsesMultiples) =>
        question.reponsesPossibles
          .flatMap(
            (rep) =>
              rep.questions?.filter(
                (q) => q.identifiant === reponsesMultiples.identifiant,
              ) || [],
          )
          .flatMap((questionATiroir) =>
            questionATiroir.reponsesPossibles.filter((reponsePossible) =>
              reponsesMultiples.reponses.has(reponsePossible.identifiant),
            ),
          )
          .flatMap((reponsePossible) => ({
            identifiant: reponsesMultiples.identifiant,
            note: reponsePossible.resultat?.note,
          })),
      )
      .flatMap((note) => note);
  }
}
