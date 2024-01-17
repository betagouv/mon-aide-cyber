import { MesureDiagnostic, QuestionDiagnostic } from './Diagnostic';
import { Mesures } from './Mesures';

export class MoteurMesures {
  static genere(
    question: QuestionDiagnostic,
    mesures: Mesures,
  ): MesureDiagnostic[] {
    return [
      ...this.mesuresMultiples(question),
      ...this.mesuresUniques(question),
    ]
      .map((mesure) => ({
        mesureTrouvee: mesures[mesure.identifiant],
        niveau: mesure.niveau,
        repondA: mesure.repondA,
      }))
      .flatMap((mesure) => [
        {
          niveau:
            mesure.niveau === 1
              ? mesure.mesureTrouvee.niveau1
              : mesure.mesureTrouvee.niveau2!,
          priorisation: mesure.mesureTrouvee.priorisation as number,
          repondA: mesure.repondA,
        },
      ]);
  }

  private static mesuresMultiples(question: QuestionDiagnostic) {
    return question.reponsesPossibles
      .flatMap((reponsePossible) => reponsePossible.questions || [])
      .flatMap((questionATiroir) => ({
        reponses: questionATiroir.reponsesPossibles.filter((reponsePossible) =>
          question.reponseDonnee.reponsesMultiples
            .flatMap((reponsesDonnees) => Array.from(reponsesDonnees.reponses))
            .includes(reponsePossible.identifiant),
        ),
        identifiantQuestion: questionATiroir.identifiant,
      }))
      .flatMap((rep) =>
        rep.reponses.flatMap(
          (reponse) =>
            reponse.resultat?.recommandations?.map((rec) => ({
              ...rec,
              repondA: rep.identifiantQuestion,
            })) || [],
        ),
      );
  }

  private static mesuresUniques(question: QuestionDiagnostic) {
    return question.reponsesPossibles
      .filter((rep) => rep.identifiant === question.reponseDonnee.reponseUnique)
      .flatMap(
        (rep) =>
          rep.resultat?.recommandations?.map((rec) => ({
            ...rec,
            repondA: question.identifiant,
          })) || [],
      );
  }
}
