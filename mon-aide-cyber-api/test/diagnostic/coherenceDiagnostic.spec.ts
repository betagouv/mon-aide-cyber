import { describe, expect, it } from 'vitest';
import { referentiel } from '../../src/diagnostic/donneesReferentiel';
import { tableauMesures } from '../../src/diagnostic/donneesMesures';
import {
  QuestionChoixMultiple,
  QuestionChoixUnique,
  RegleDeGestionAjouteReponse,
  RegleDeGestionSupprimeReponse,
  ReponsePossible,
} from '../../src/diagnostic/Referentiel';

describe('Cohérence du référentiel et des mesures', () => {
  const identifiantsDeMesures = (r: ReponsePossible): string[] => {
    return (
      r.resultat?.mesures
        ?.map((rec) => rec.identifiant)
        .filter((rec): rec is string => !!rec) || []
    );
  };
  const tousLesIdentifiantsDeMesures = (
    q: QuestionChoixUnique | QuestionChoixMultiple
  ): string[] => {
    return q.reponsesPossibles.flatMap((r) => {
      return [
        ...identifiantsDeMesures(r),
        ...(r.questions?.flatMap((q) =>
          q.reponsesPossibles.flatMap((r) => identifiantsDeMesures(r))
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
                ([reco]) => reco
              );

              expect(
                toutesLesMesures.find((r) => r === reco)
              ).not.toBeUndefined();
            }
          );
        }
      );
    }
  );

  describe.each(Object.entries(tableauMesures).map(([reco]) => reco))(
    'La mesure %s',
    (reco) => {
      it('est référencée dans le référentiel', () => {
        expect(
          new Set(
            toutesLesQuestions().flatMap((q) =>
              q.questions.flatMap((q) => Array.from(q.recos))
            )
          ).has(reco)
        ).toBeTruthy();
      });
    }
  );

  it('Les réponses sont uniques', () => {
    const toutesLesReponses = Object.entries(referentiel)
      .filter(([thematique]) => thematique !== 'contexte')
      .flatMap(([_, questions]) => {
        return {
          reponses: questions.questions.flatMap((q) => {
            const identifiants: string[] = [];
            return q.reponsesPossibles.reduce((prev, cur) => {
              prev.push(cur.identifiant);
              if (cur.questions) {
                const strings = cur.questions
                  ?.flatMap((q) =>
                    q.reponsesPossibles.flatMap((r) => r.identifiant)
                  )
                  .filter((r) => !!r);
                prev.push(...strings);
              }
              return prev;
            }, identifiants);
          }),
        };
      })
      .flatMap((r) => r.reponses);

    const set = toutesLesReponses.reduce((prev, curr) => {
      return new Set([...prev, curr]);
    }, new Set());

    expect(toutesLesReponses.length).toStrictEqual(set.size);
  });

  describe('Les règles de gestion', () => {
    const toutesLesReglesCorrespondantes = (
      strategie: 'AJOUTE_REPONSE' | 'SUPPRIME_REPONSE'
    ): {
      question: string;
      regle: RegleDeGestionAjouteReponse | RegleDeGestionSupprimeReponse;
    }[] =>
      Object.entries(referentiel)
        .flatMap(([_, questions]) =>
          questions.questions.flatMap((q) =>
            q.reponsesPossibles.flatMap((r) => ({
              question: q.identifiant,
              regle: r.regle,
            }))
          )
        )
        .filter(
          (
            r
          ): r is {
            question: string;
            regle: RegleDeGestionAjouteReponse | RegleDeGestionSupprimeReponse;
          } => !!r
        )
        .filter((r) => r.regle !== undefined)
        .filter((r) => r.regle.strategie === strategie);

    const questionsEtReponses = Object.entries(referentiel)
      .filter(([thematique]) => thematique !== 'contexte')
      .flatMap(([_, questions]) => {
        return {
          questions: questions.questions.flatMap((q) => ({
            question: q.identifiant,
            reponses: q.reponsesPossibles.map((r) => r.identifiant),
          })),
        };
      });

    const reglesAjouteReponse =
      toutesLesReglesCorrespondantes('AJOUTE_REPONSE');
    const reglesSupprimeReponse =
      toutesLesReglesCorrespondantes('SUPPRIME_REPONSE');

    describe.each(reglesAjouteReponse)(
      'Pour la question $question et la règle AJOUTE_REPONSE',
      (regle) => {
        it.each((regle.regle as RegleDeGestionAjouteReponse).reponses)(
          'La reponse $reponseDonnee et la question $identifiantQuestion existent',
          (reponse) => {
            expect(
              questionsEtReponses.flatMap((questions) =>
                questions.questions.flatMap((q) => q.question)
              )
            ).contains(reponse.identifiantQuestion);
            expect(
              questionsEtReponses.flatMap((questions) =>
                questions.questions.flatMap((q) => q.reponses.flatMap((r) => r))
              )
            ).contains(reponse.reponseDonnee);
          }
        );
      }
    );

    describe.each(reglesSupprimeReponse)(
      'Pour la question $question et la règle SUPPRIME_REPONSE',
      (regle) => {
        it.each((regle.regle as RegleDeGestionSupprimeReponse).questions)(
          'La question %s existe',
          (question) => {
            expect(
              questionsEtReponses.flatMap((questions) =>
                questions.questions.flatMap((q) => q.question)
              )
            ).contains(question);
          }
        );
      }
    );
  });
});
