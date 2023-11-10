import {
  Diagnostic,
  estReponseMultiple,
  QuestionDiagnostic,
} from './Diagnostic';
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
          .filter((question) => question.reponseDonnee.reponse != null)
          .flatMap((question) => [
            ...this.genereLesNotesPourReponseUnique(question),
            ...this.genereLesNotesPourReponsesMultiples(question),
          ]),
      }),
      {},
    );
  };

  private static genereLesNotesPourReponseUnique(question: QuestionDiagnostic) {
    return question.reponsesPossibles
      .filter((reponsePossible) =>
        !estReponseMultiple(question.reponseDonnee.reponse)
          ? reponsePossible.identifiant === question.reponseDonnee.reponse
          : reponsePossible.identifiant ===
            question.reponseDonnee.reponse.identifiant,
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
  ) {
    if (estReponseMultiple(question.reponseDonnee.reponse)) {
      return question.reponseDonnee.reponse.reponses
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
        .flatMap((questionDiagnostic) => questionDiagnostic);
    }
    return [];
  }
}
