import { RegleDeGestionAjouteReponse } from './Referentiel';
import { Diagnostic } from './Diagnostic';

export const appliqueRegleDeGestion = (
  regleDeGestion: RegleDeGestionAjouteReponse,
  diagnostic: Diagnostic
) => {
  (regleDeGestion as RegleDeGestionAjouteReponse).reponses.forEach(
    (reponse) => {
      const questions = Object.entries(diagnostic.referentiel)
        .flatMap(([_, question]) => question.questions)
        .filter(
          (questions) => questions.identifiant === reponse.identifiantQuestion
        );
      questions.forEach(
        (q) =>
          (q.reponseDonnee = {
            reponseUnique: reponse.reponseDonnee,
            reponsesMultiples: [],
          })
      );
    }
  );
};
