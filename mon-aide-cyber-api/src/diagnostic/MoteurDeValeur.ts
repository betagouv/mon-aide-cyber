import {
  Diagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
} from './Diagnostic';
import { Indice } from './Indice';
import { Resultat } from './Referentiel';

export type ValeursDesReponsesAuDiagnostic = {
  [thematique: string]: { identifiant: string; indice: Indice }[];
};

export class MoteurDeValeur {
  public static genereLesValeursDesReponses = (
    diagnostic: Diagnostic,
  ): ValeursDesReponsesAuDiagnostic => {
    function laThematiqueContientDesResultats(questions: QuestionsThematique) {
      return (
        questions.questions.filter(
          (q) =>
            q.reponsesPossibles.filter((r) => {
              const questionsTiroirContenantDesResultats = r.questions?.filter(
                (q) =>
                  q.reponsesPossibles.filter((r) => !!r.resultat).length > 0,
              );
              return (
                !!r.resultat ||
                (questionsTiroirContenantDesResultats &&
                  questionsTiroirContenantDesResultats.length > 0)
              );
            }).length > 0,
        ).length > 0
      );
    }

    return Object.entries(diagnostic.referentiel)
      .filter(([, questions]) => laThematiqueContientDesResultats(questions))
      .reduce(
        (reducteur, [thematique, questions]) => ({
          ...reducteur,
          [thematique]: questions.questions
            .filter((question) => question.reponseDonnee.reponseUnique != null)
            .flatMap((question) => [
              ...this.genereLesValeursDesReponsesUniques(question),
              ...this.genereLesValeursDesReponsesMultiples(question),
            ]),
        }),
        {},
      );
  };

  private static genereLesValeursDesReponsesUniques(
    question: QuestionDiagnostic,
  ): { identifiant: string; indice: Indice }[] {
    return question.reponsesPossibles
      .filter(
        (reponsePossible) =>
          reponsePossible.identifiant === question.reponseDonnee.reponseUnique,
      )
      .map((reponsePossible) => reponsePossible.resultat)
      .filter(
        (reponsePossible): reponsePossible is Resultat =>
          reponsePossible !== undefined,
      )
      .flatMap((reponsePossible) => ({
        identifiant: question.identifiant,
        indice: reponsePossible.indice,
      }));
  }

  private static genereLesValeursDesReponsesMultiples(
    question: QuestionDiagnostic,
  ): { identifiant: string; indice: Indice }[] {
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
            questionATiroir.reponsesPossibles
              .filter((reponsePossible) =>
                reponsesMultiples.reponses.has(reponsePossible.identifiant),
              )
              .map((reponsePossible) => reponsePossible.resultat)
              .filter((resultat): resultat is Resultat => !!resultat),
          )
          .flatMap((reponsePossible) => ({
            identifiant: reponsesMultiples.identifiant,
            indice: reponsePossible.indice,
          })),
      )
      .flatMap((valeur) => valeur);
  }
}
