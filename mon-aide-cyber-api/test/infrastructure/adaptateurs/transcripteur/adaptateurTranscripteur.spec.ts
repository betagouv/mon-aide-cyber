import { describe, expect, it } from 'vitest';
import { referentiel } from '../../../../src/diagnostic/donneesReferentiel';
import { adaptateurTranscripteur } from '../../../../src/infrastructure/adaptateurs/transcripteur/adaptateurTranscripteur';

describe('Cohérence du transcripteur avec le référentiel', () => {
  const toutesLesQuestions = (): {
    thematique: string;
    questions: { question: string }[];
  }[] => {
    return Object.entries(referentiel).flatMap(([thematique, questions]) => {
      return {
        thematique: thematique,
        questions: questions.questions.flatMap((q) => ({
          question: q.identifiant,
        })),
      };
    });
  };

  const toutesLesQuestionsReferenceesDansLeTranscripteur: {
    identifiantQuestion: string;
  }[] = Object.entries(
    adaptateurTranscripteur().transcripteur().thematiques
  ).flatMap(([, thematique]) =>
    thematique.groupes.flatMap((groupe) =>
      groupe.questions.flatMap((q) => ({
        identifiantQuestion: q.identifiant,
      }))
    )
  );

  describe.each(toutesLesQuestions())(
    'Pour la thématique "$thematique"',
    (thematique) => {
      it.each(thematique.questions)(
        'la question "$question" est référencée dans le transcripteur',
        (question) => {
          expect(
            toutesLesQuestionsReferenceesDansLeTranscripteur.find(
              (q) => q.identifiantQuestion === question.question
            )
          ).not.toBeUndefined();
        }
      );
    }
  );
});
