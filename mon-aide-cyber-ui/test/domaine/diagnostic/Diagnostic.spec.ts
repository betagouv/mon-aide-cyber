import { describe, expect, it } from 'vitest';
import { uneReponsePossible } from '../../constructeurs/constructeurReponsePossible.ts';
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
  uneQuestionTiroirAChoixUnique,
} from '../../constructeurs/constructeurQuestions.ts';
import {
  Reponse,
  reponseMultipleDonnee,
  reponseTiroirMultipleDonnee,
  reponseTiroirUniqueDonnee,
  reponseUniqueDonnee,
} from '../../../src/domaine/diagnostic/Diagnostic.ts';

describe('Diagnostic', () => {
  describe('Dans le cas de réponses faites', () => {
    describe('dans le cas de question simple', () => {
      it('retourne la réponse à la question', () => {
        const nouvelleReponse = uneReponsePossible().construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('Une question?')
          .avecDesReponses([nouvelleReponse])
          .construis();

        const reponse = reponseUniqueDonnee(
          question,
          nouvelleReponse.identifiant
        );

        expect(reponse).toStrictEqual<Reponse>({
          reponseDonnee: nouvelleReponse.identifiant,
          identifiantQuestion: question.identifiant,
        });
      });
    });

    describe('dans le cas de question à choix multiples', () => {
      it("prend en compte l'ajout d'une réponse", () => {
        const premiereReponse = uneReponsePossible().construis();
        const deuxiemeReponse = uneReponsePossible().construis();
        const troisiemeReponse = uneReponsePossible().construis();
        const question = uneQuestionAChoixMultiple()
          .avecDesReponses([premiereReponse, deuxiemeReponse, troisiemeReponse])
          .avecUneReponseMultipleDonnee([troisiemeReponse])
          .construis();

        const reponse = reponseMultipleDonnee(
          question,
          premiereReponse.identifiant
        );

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: question.identifiant,
          reponseDonnee: [
            troisiemeReponse.identifiant,
            premiereReponse.identifiant,
          ],
        });
      });

      it("retire un élément de la réponse lorsqu'il est déja présent (l'utilisateur désélectionne cet élément)", () => {
        const premiereReponse = uneReponsePossible().construis();
        const deuxiemeReponse = uneReponsePossible().construis();
        const troisiemeReponse = uneReponsePossible().construis();
        const question = uneQuestionAChoixMultiple()
          .avecDesReponses([premiereReponse, deuxiemeReponse, troisiemeReponse])
          .avecUneReponseMultipleDonnee([premiereReponse, troisiemeReponse])
          .construis();

        const reponse = reponseMultipleDonnee(
          question,
          premiereReponse.identifiant
        );

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: question.identifiant,
          reponseDonnee: [troisiemeReponse.identifiant],
        });
      });
    });

    describe('dans le cas de question à tiroir', () => {
      it('prend en compte les réponses à choix multiple', () => {
        const nouvelleReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionTiroirAChoixMultiple()
              .avecLibelle('QCM')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 2').construis(),
                uneReponsePossible().avecLibelle('choix 3').construis(),
              ])
              .construis()
          )
          .construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('Une question?')
          .avecDesReponses([nouvelleReponse])
          .avecLaReponseDonnee(nouvelleReponse, [
            { identifiant: 'qcm', reponses: new Set(['choix-2']) },
          ])
          .construis();

        const reponse = reponseTiroirMultipleDonnee(question, {
          identifiant: nouvelleReponse.identifiant,
          questionTiroir: { identifiant: 'qcm', valeur: 'choix-3' },
        });

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: 'une-question',
          reponseDonnee: {
            reponse: nouvelleReponse.identifiant,
            questions: [
              {
                identifiant: 'qcm',
                reponses: ['choix-2', 'choix-3'],
              },
            ],
          },
        });
      });

      it("retire un élément de la réponse lorsqu'il est déja présent (l'utilisateur désélectionne cet élément)", () => {
        const nouvelleReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionTiroirAChoixMultiple()
              .avecLibelle('QCM')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 2').construis(),
                uneReponsePossible().avecLibelle('choix 3').construis(),
                uneReponsePossible().avecLibelle('choix 4').construis(),
              ])
              .construis()
          )
          .construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('Une question?')
          .avecDesReponses([nouvelleReponse])
          .avecLaReponseDonnee(nouvelleReponse, [
            {
              identifiant: 'qcm',
              reponses: new Set(['choix-2', 'choix-3', 'choix-4']),
            },
          ])
          .construis();

        const reponse = reponseTiroirMultipleDonnee(question, {
          identifiant: nouvelleReponse.identifiant,
          questionTiroir: { identifiant: 'qcm', valeur: 'choix-4' },
        });

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: 'une-question',
          reponseDonnee: {
            reponse: nouvelleReponse.identifiant,
            questions: [
              {
                identifiant: 'qcm',
                reponses: ['choix-2', 'choix-3'],
              },
            ],
          },
        });
      });

      it('prend en compte les réponses à plusieurs questions à tiroir', () => {
        const nouvelleReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionTiroirAChoixMultiple()
              .avecLibelle('tiroir 1')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 12').construis(),
                uneReponsePossible().avecLibelle('choix 13').construis(),
              ])
              .construis()
          )
          .avecUneQuestion(
            uneQuestionTiroirAChoixMultiple()
              .avecLibelle('tiroir 2')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 21').construis(),
                uneReponsePossible().avecLibelle('choix 23').construis(),
              ])
              .construis()
          )
          .construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('Une Question')
          .avecDesReponses([nouvelleReponse])
          .avecLaReponseDonnee(nouvelleReponse, [
            {
              identifiant: 'tiroir-1',
              reponses: new Set(['choix-12', 'choix-13']),
            },
            {
              identifiant: 'tiroir-2',
              reponses: new Set(['choix-21']),
            },
          ])
          .construis();

        const reponse = reponseTiroirMultipleDonnee(question, {
          identifiant: nouvelleReponse.identifiant,
          questionTiroir: { identifiant: 'tiroir-2', valeur: 'choix-23' },
        });

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: 'une-question',
          reponseDonnee: {
            reponse: nouvelleReponse.identifiant,
            questions: [
              { identifiant: 'tiroir-1', reponses: ['choix-12', 'choix-13'] },
              { identifiant: 'tiroir-2', reponses: ['choix-21', 'choix-23'] },
            ],
          },
        });
      });

      it('prend en compte les réponses à choix unique avec plusieurs questions à tiroir', () => {
        const nouvelleReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionTiroirAChoixUnique()
              .avecLibelle('tiroir 1')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 12').construis(),
                uneReponsePossible().avecLibelle('choix 13').construis(),
              ])
              .construis()
          )
          .construis();
        const uneAutreReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionTiroirAChoixUnique()
              .avecLibelle('tiroir 2')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 22').construis(),
                uneReponsePossible().avecLibelle('choix 23').construis(),
              ])
              .construis()
          )
          .avecUneQuestion(
            uneQuestionTiroirAChoixUnique()
              .avecLibelle('tiroir 3')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('choix 32').construis(),
                uneReponsePossible().avecLibelle('choix 33').construis(),
              ])
              .construis()
          )
          .construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('Une Question')
          .avecDesReponses([nouvelleReponse, uneAutreReponse])
          .avecLaReponseDonnee(nouvelleReponse, [
            {
              identifiant: 'tiroir-1',
              reponses: new Set(['choix-12']),
            },
          ])
          .avecLaReponseDonnee(uneAutreReponse, [
            {
              identifiant: 'tiroir-2',
              reponses: new Set(['choix-23']),
            },
          ])
          .construis();

        const reponse = reponseTiroirUniqueDonnee(question, {
          identifiant: uneAutreReponse.identifiant,
          questionTiroir: { identifiant: 'tiroir-3', valeur: 'choix-32' },
        });

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: 'une-question',
          reponseDonnee: {
            reponse: uneAutreReponse.identifiant,
            questions: [
              { identifiant: 'tiroir-2', reponses: ['choix-23'] },
              { identifiant: 'tiroir-3', reponses: ['choix-32'] },
            ],
          },
        });
      });

      it('prend en compte les réponses à choix unique', () => {
        const nouvelleReponse = uneReponsePossible()
          .avecUneQuestion(
            uneQuestionAChoixUnique()
              .avecLibelle('choix unique')
              .avecDesReponses([
                uneReponsePossible().avecLibelle('1').construis(),
                uneReponsePossible().avecLibelle('2').construis(),
                uneReponsePossible().avecLibelle('3').construis(),
              ])
              .construis()
          )
          .construis();
        const question = uneQuestionAChoixUnique()
          .avecLibelle('une question?')
          .avecDesReponses([nouvelleReponse])
          .avecLaReponseDonnee(nouvelleReponse, [
            { identifiant: 'choix-unique', reponses: new Set(['2']) },
          ])
          .construis();

        const reponse = reponseTiroirUniqueDonnee(question, {
          identifiant: nouvelleReponse.identifiant,
          questionTiroir: { identifiant: 'choix-unique', valeur: '1' },
        });

        expect(reponse).toStrictEqual<Reponse>({
          identifiantQuestion: 'une-question',
          reponseDonnee: {
            reponse: nouvelleReponse.identifiant,
            questions: [{ identifiant: 'choix-unique', reponses: ['1'] }],
          },
        });
      });
    });
  });
});
