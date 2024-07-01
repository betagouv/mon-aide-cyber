import {
  RegleDeGestionAjouteReponse,
  RegleDeGestionSupprimeReponse,
} from './Referentiel';
import { Diagnostic } from './Diagnostic';

export const StrategiesRegleDeGestion: Map<
  'AJOUTE_REPONSE' | 'SUPPRIME_REPONSE',
  {
    applique: (
      regleDeGestion:
        | RegleDeGestionAjouteReponse
        | RegleDeGestionSupprimeReponse,
      diagnostic: Diagnostic
    ) => void;
  }
> = new Map([
  [
    'AJOUTE_REPONSE',
    {
      applique: (regleDeGestion, diagnostic) => {
        (regleDeGestion as RegleDeGestionAjouteReponse).reponses.forEach(
          (reponse) => {
            const questions = Object.entries(diagnostic.referentiel)
              .flatMap(([_, question]) => question.questions)
              .filter(
                (questions) =>
                  questions.identifiant === reponse.identifiantQuestion
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
      },
    },
  ],
  [
    'SUPPRIME_REPONSE',
    {
      applique: (regleDeGestion, diagnostic) => {
        (regleDeGestion as RegleDeGestionSupprimeReponse).questions.forEach(
          (identifiantQuestion) => {
            const questions = Object.entries(diagnostic.referentiel)
              .flatMap(([_, question]) => question.questions)
              .filter(
                (questions) => questions.identifiant === identifiantQuestion
              );
            questions.forEach(
              (q) =>
                (q.reponseDonnee = {
                  reponseUnique: null,
                  reponsesMultiples: [],
                })
            );
          }
        );
      },
    },
  ],
]);
