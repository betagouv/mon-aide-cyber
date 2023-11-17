import { describe, expect } from 'vitest';
import { referentiel } from '../../src/diagnostic/donneesReferentiel';
import { tableauRecommandations } from '../../src/diagnostic/donneesTableauRecommandations';
import {
  QuestionChoixMultiple,
  QuestionChoixUnique,
  ReponsePossible,
} from '../../src/diagnostic/Referentiel';

describe('Cohérence du référentiel et des recommandations', () => {
  const identifiantsDeRecommandations = (r: ReponsePossible): string[] => {
    return (
      r.resultat?.recommandations
        ?.map((rec) => rec.identifiant)
        .filter((rec): rec is string => !!rec) || []
    );
  };
  const tousLesIdentifiantsDeRecommandations = (
    q: QuestionChoixUnique | QuestionChoixMultiple,
  ): string[] => {
    return q.reponsesPossibles.flatMap((r) => {
      return [
        ...identifiantsDeRecommandations(r),
        ...(r.questions?.flatMap((q) =>
          q.reponsesPossibles.flatMap((r) => identifiantsDeRecommandations(r)),
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
            recos: new Set(tousLesIdentifiantsDeRecommandations(q)),
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
            'portant la recommandation "%s" est référencée dans les recommandations',
            (reco) => {
              const toutesLesRecommandations = Object.entries(
                tableauRecommandations,
              ).map(([reco]) => reco);

              expect(
                toutesLesRecommandations.find((r) => r === reco),
              ).not.toBeUndefined();
            },
          );
        },
      );
    },
  );

  describe.each(Object.entries(tableauRecommandations).map(([reco]) => reco))(
    'La recommandation %s',
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
