import {
  Diagnostic,
  QuestionDiagnostic,
  QuestionsThematique,
} from './Diagnostic';
import { Poids, Valeur } from './Indice';
import { Resultat } from './Referentiel';

type Indice = { identifiant: string; indice: Valeur; poids: Poids };

type IndiceIntermediaire = {
  resultat: Resultat;
  poids: Poids;
};

export type ValeursDesIndicesAuDiagnostic = {
  [thematique: string]: Indice[];
};

export class MoteurIndice {
  public static genereLesIndicesDesReponses = (
    diagnostic: Diagnostic
  ): ValeursDesIndicesAuDiagnostic => {
    function laThematiqueContientDesResultats(questions: QuestionsThematique) {
      return (
        questions.questions.filter(
          (q) =>
            q.reponsesPossibles.filter((r) => {
              const questionsTiroirContenantDesResultats = r.questions?.filter(
                (q) =>
                  q.reponsesPossibles.filter((r) => !!r.resultat).length > 0
              );
              return (
                !!r.resultat ||
                (questionsTiroirContenantDesResultats &&
                  questionsTiroirContenantDesResultats.length > 0)
              );
            }).length > 0
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
              ...this.genereLesIndicesDesReponsesUniques(question),
              ...this.genereLesIndicesDesReponsesMultiples(question),
            ]),
        }),
        {}
      );
  };

  private static genereLesIndicesDesReponsesUniques(
    question: QuestionDiagnostic
  ): Indice[] {
    return question.reponsesPossibles
      .filter(
        (reponsePossible) =>
          reponsePossible.identifiant === question.reponseDonnee.reponseUnique
      )
      .map((reponsePossible) => reponsePossible.resultat)
      .filter(
        (reponsePossible): reponsePossible is Resultat =>
          reponsePossible !== undefined
      )
      .flatMap((reponsePossible) => ({
        identifiant: question.identifiant,
        indice: reponsePossible.indice.valeur,
        poids: question.poids!,
      }));
  }

  private static genereLesIndicesDesReponsesMultiples(
    question: QuestionDiagnostic
  ): Indice[] {
    return question.reponseDonnee.reponsesMultiples
      .flatMap((reponsesMultiples) =>
        question.reponsesPossibles
          .flatMap(
            (rep) =>
              rep.questions?.filter(
                (q) => q.identifiant === reponsesMultiples.identifiant
              ) || []
          )
          .flatMap((questionATiroir) =>
            questionATiroir.reponsesPossibles
              .filter((reponsePossible) =>
                reponsesMultiples.reponses.has(reponsePossible.identifiant)
              )
              .filter((reponsePossible) => !!reponsePossible.resultat)
              .map(
                (reponsePossible) =>
                  ({
                    resultat: reponsePossible.resultat,
                    poids: questionATiroir.poids,
                  }) as IndiceIntermediaire
              )
              .filter(
                (indice: IndiceIntermediaire): indice is IndiceIntermediaire =>
                  !!indice
              )
          )
          .flatMap((indice) => ({
            identifiant: reponsesMultiples.identifiant,
            indice: indice.resultat.indice.valeur,
            poids: indice.poids,
          }))
      )
      .flatMap((valeurIndice) => valeurIndice);
  }
}
