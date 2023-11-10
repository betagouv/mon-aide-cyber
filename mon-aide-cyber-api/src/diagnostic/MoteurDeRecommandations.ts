import {
  estReponseMultiple,
  QuestionDiagnostic,
  RecommandationDiagnostic,
} from './Diagnostic';
import { TableauDeRecommandations } from './TableauDeRecommandations';

export class MoteurDeRecommandations {
  static genere(
    question: QuestionDiagnostic,
    tableauDeRecommandations: TableauDeRecommandations,
  ): RecommandationDiagnostic[] {
    return [
      ...this.recommandationsMultiples(question),
      ...this.recommandationsUnique(question),
    ]
      .map((recommandation) => ({
        recommandationTrouvee:
          tableauDeRecommandations[recommandation.identifiant],
        niveau: recommandation.niveau,
        repondA: recommandation.repondA,
      }))
      .flatMap((recommandation) => [
        {
          niveau:
            recommandation.niveau === 1
              ? recommandation.recommandationTrouvee.niveau1
              : recommandation.recommandationTrouvee.niveau2!,
          priorisation: recommandation.recommandationTrouvee
            .priorisation as number,
          repondA: recommandation.repondA,
        },
      ]);
  }

  private static recommandationsMultiples(question: QuestionDiagnostic) {
    return question.reponsesPossibles
      .flatMap((reponsePossible) => reponsePossible.questions || [])
      .flatMap((questionATiroir) => ({
        reponses: questionATiroir.reponsesPossibles.filter((reponsePossible) =>
          estReponseMultiple(question.reponseDonnee.reponse)
            ? question.reponseDonnee.reponse.reponses
                .flatMap((reponsesDonnees) =>
                  Array.from(reponsesDonnees.reponses),
                )
                .includes(reponsePossible.identifiant)
            : [],
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

  private static recommandationsUnique(question: QuestionDiagnostic) {
    return question.reponsesPossibles
      .filter((rep) =>
        estReponseMultiple(question.reponseDonnee.reponse)
          ? rep.identifiant === question.reponseDonnee.reponse.identifiant
          : rep.identifiant === question.reponseDonnee.reponse,
      )
      .flatMap(
        (rep) =>
          rep.resultat?.recommandations?.map((rec) => ({
            ...rec,
            repondA: question.identifiant,
          })) || [],
      );
  }
}
