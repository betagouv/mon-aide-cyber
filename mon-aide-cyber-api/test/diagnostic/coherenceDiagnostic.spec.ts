import { describe, expect } from 'vitest';
import { referentiel } from '../../src/diagnostic/donneesReferentiel';
import { tableauMesures } from '../../src/diagnostic/donneesMesures';
import {
  QuestionChoixMultiple,
  QuestionChoixUnique,
  ReponsePossible,
} from '../../src/diagnostic/Referentiel';

describe('Cohérence du référentiel et des mesures', () => {
  const identifiantsDeMesures = (r: ReponsePossible): string[] => {
    return (
      r.resultat?.recommandations
        ?.map((rec) => rec.identifiant)
        .filter((rec): rec is string => !!rec) || []
    );
  };
  const tousLesIdentifiantsDeMesures = (
    q: QuestionChoixUnique | QuestionChoixMultiple,
  ): string[] => {
    return q.reponsesPossibles.flatMap((r) => {
      return [
        ...identifiantsDeMesures(r),
        ...(r.questions?.flatMap((q) =>
          q.reponsesPossibles.flatMap((r) => identifiantsDeMesures(r)),
        ) || []),
      ];
    });
  };
  const toutesLesQuestions = (): {
    thematique: string;
    questions: { question: string; recos: Set<string> }[];
  }[] => {
    return Object.entries(referentiel)
      .filter(([thematique]) => thematique !== 'contexte')
      .flatMap(([thematique, questions]) => {
        return {
          thematique: thematique,
          questions: questions.questions.flatMap((q) => ({
            question: q.identifiant,
            recos: new Set(tousLesIdentifiantsDeMesures(q)),
          })),
        };
      });
  };

  describe.each(toutesLesQuestions())(
    'Pour la thématique "$thematique"',
    (thematique) => {
      describe.each(thematique.questions)(
        'la question "$question"',
        (question) => {
          it.each(Array.from(question.recos))(
            'portant la mesure "%s" est référencée dans les mesures',
            (reco) => {
              const toutesLesMesures = Object.entries(tableauMesures).map(
                ([reco]) => reco,
              );

              expect(
                toutesLesMesures.find((r) => r === reco),
              ).not.toBeUndefined();
            },
          );
        },
      );
    },
  );

  describe.each(Object.entries(tableauMesures).map(([reco]) => reco))(
    'La mesure %s',
    (reco) => {
      it('est référencée dans le référentiel', () => {
        expect(
          new Set(
            toutesLesQuestions().flatMap((q) =>
              q.questions.flatMap((q) => Array.from(q.recos)),
            ),
          ).has(reco),
        ).toBeTruthy();
      });
    },
  );
});
