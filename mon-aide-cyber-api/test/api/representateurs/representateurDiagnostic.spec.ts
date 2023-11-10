import { describe, expect } from 'vitest';
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
  unReferentielSansThematiques,
} from '../../constructeurs/constructeurReferentiel';
import {
  unDiagnostic,
  uneNouvelleReponseDonnee,
} from '../../constructeurs/constructeurDiagnostic';
import { representeLeDiagnosticPourLeClient } from '../../../src/api/representateurs/representateurDiagnostic';
import {
  fabriqueTranscripteurThematiquesOrdonnees,
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
} from './transcripteursDeTest';
import {
  Question,
  QuestionChoixMultiple,
  QuestionChoixUnique,
  ReponsePossible,
} from '../../../src/diagnostic/Referentiel';
import {
  RepresentationDiagnostic,
  RepresentationQuestionChoixMultiple,
  RepresentationQuestionChoixUnique,
  RepresentationQuestionTiroir,
} from '../../../src/api/representateurs/types';
import { Diagnostic } from '../../../src/diagnostic/Diagnostic';

describe('Le représentateur de diagnostic', () => {
  describe('Afin de fournir les actions possibles pour un client', () => {
    it('fournit l’action ’repondre’ dans la réponse', () => {
      const diagnostic = unDiagnostic().construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      expect(
        representationDiagnostic.referentiel.contexte.actions,
      ).toStrictEqual([
        {
          action: 'repondre',
          chemin: 'contexte',
          ressource: {
            url: `/api/diagnostic/${diagnostic.identifiant}`,
            methode: 'PATCH',
          },
        },
      ]);
      expect(representationDiagnostic.actions[1]).toStrictEqual({
        contexte: {
          action: 'repondre',
          ressource: {
            url: `/api/diagnostic/${diagnostic.identifiant}`,
            methode: 'PATCH',
          },
        },
      });
    });

    it("fournit l'action 'terminer' dans la réponse", () => {
      const diagnostic = unDiagnostic().construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      expect(representationDiagnostic.actions[0]).toStrictEqual({
        action: 'terminer',
        ressource: {
          url: `/api/diagnostic/${diagnostic.identifiant}/termine`,
          methode: 'GET',
        },
      });
    });
  });

  describe('Afin de représenter l’affichage de la saisie pour le client', () => {
    it('présente le format de réponse pour une question', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion().aChoixUnique('Des réponses?').construis(),
            )
            .construis(),
        )
        .construis();

      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        transcripteurAvecSaisiesLibres,
      );

      expect(
        diagnosticRepresente.referentiel['contexte'].questions[0].reponseDonnee,
      ).toStrictEqual({
        valeur: null,
        reponses: [],
      });
    });
    it("définit le type de saisie que doit faire l'utilisateur", () => {
      const question = uneQuestion()
        .aChoixUnique('Quelle est la question?', [
          { identifiant: 'reponse1', libelle: 'réponse 1' },
          { identifiant: 'reponse2', libelle: 'réponse 2' },
          { identifiant: 'reponse3', libelle: 'réponse 3' },
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel().ajouteUneQuestionAuContexte(question).construis(),
        )
        .construis();

      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        transcripteurAvecSaisiesLibres,
      );

      const questionRetournee =
        diagnosticRepresente.referentiel.contexte.questions[0];
      const reponsesPossibles = questionRetournee.reponsesPossibles;
      expect(questionRetournee.type).toBe('choixUnique');
      expect(reponsesPossibles[0].type).toStrictEqual({
        type: 'saisieLibre',
        format: 'texte',
      });
      expect(reponsesPossibles[1].type).toStrictEqual({
        type: 'saisieLibre',
        format: 'nombre',
      });
      expect(reponsesPossibles[2].type).toBeUndefined();
    });

    it('définit la manière dont est présentée la question sous forme de liste', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion().aChoixUnique('Question liste?').construis(),
            )
            .construis(),
        )
        .construis();
      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        {
          thematiques: {
            contexte: {
              questions: [
                { identifiant: 'question-liste', type: 'liste', reponses: [] },
              ],
            },
          },
        },
      );

      const question = diagnosticRepresente.referentiel.contexte.questions[0];
      expect(question.type).toBe('liste');
    });

    describe("Lorsqu'il contient des réponses avec des questions tiroirs", () => {
      describe('définit la manière dont est présentée la question et ses réponses', () => {
        it('avec une seule question et une seule réponse', () => {
          const question = uneQuestion()
            .aChoixUnique('Question avec réponse tiroir?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Réponse 0')
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple('Question tiroir?')
                    .avecReponsesPossibles([
                      uneReponsePossible().avecLibelle('Réponse 1').construis(),
                    ])
                    .construis(),
                )
                .construis(),
            ])
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            unDiagnostic()
              .avecUnReferentiel(
                unReferentiel()
                  .ajouteUneQuestionAuContexte(question)
                  .construis(),
              )
              .construis(),
            transcripteurQuestionTiroir,
          );

          expect(
            diagnosticRepresente.referentiel.contexte.questions,
          ).toStrictEqual(resultatsAttendus([question]));
        });

        it('avec une seule question et plusieurs réponses', () => {
          const reponse3 = uneReponsePossible()
            .avecLibelle('Réponse 3')
            .construis();
          const question = uneQuestion()
            .aChoixUnique('Question avec réponse tiroir?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Réponse 0')
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple('Question tiroir?')
                    .avecReponsesPossibles([
                      uneReponsePossible().construis(),
                      uneReponsePossible().construis(),
                      reponse3,
                    ])
                    .construis(),
                )
                .construis(),
            ])
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel().ajouteUneQuestionAuContexte(question).construis(),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          const questionTiroir =
            diagnosticRepresente.referentiel.contexte.questions[0]
              .reponsesPossibles[0];
          expect(questionTiroir?.questions?.[0].identifiant).toBe(
            'question-tiroir',
          );
          expect(questionTiroir?.questions?.[0].libelle).toBe(
            'Question tiroir?',
          );
          expect(questionTiroir?.questions?.[0].type).toBe('choixMultiple');
          expect(
            questionTiroir?.questions?.[0].reponsesPossibles[2],
          ).toStrictEqual({
            identifiant: 'reponse-3',
            libelle: 'Réponse 3',
            ordre: 2,
            type: { type: 'saisieLibre', format: 'texte' },
          });
        });

        it('avec plusieurs questions', () => {
          const reponse = uneReponsePossible()
            .avecLibelle('Réponse 3')
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneQuestionAuContexte(uneQuestion().construis())
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
                    .aChoixUnique('Question avec réponse tiroir?')
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .ajouteUneQuestionATiroir(
                          uneQuestionATiroir()
                            .aChoixMultiple('Question tiroir?')
                            .avecReponsesPossibles([reponse])
                            .construis(),
                        )
                        .construis(),
                    ])
                    .construis(),
                )
                .construis(),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          const questionTiroir =
            diagnosticRepresente.referentiel.contexte.questions[1]
              .reponsesPossibles[0]?.questions?.[0];
          expect(questionTiroir?.reponsesPossibles[0]).toStrictEqual({
            identifiant: 'reponse-3',
            libelle: 'Réponse 3',
            ordre: 0,
            type: { type: 'saisieLibre', format: 'texte' },
          });
        });
        it('avec plusieurs questions à tiroir', () => {
          const premiereQuestion = uneQuestion()
            .aChoixUnique('Première question?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Réponse 1')
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple('Question 11')
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .avecLibelle('Réponse 11')
                        .construis(),
                    ])
                    .construis(),
                )
                .construis(),
            ])
            .construis();
          const secondeQuestion = uneQuestion()
            .aChoixUnique('Deuxième question?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Réponse 2')
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple('Question 21')
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .avecLibelle('Réponse 21')
                        .construis(),
                    ])
                    .construis(),
                )
                .construis(),
            ])
            .construis();

          const representationDiagnostic = representeLeDiagnosticPourLeClient(
            unDiagnostic()
              .avecUnReferentiel(
                unReferentiel()
                  .ajouteUneQuestionAuContexte(premiereQuestion)
                  .ajouteUneQuestionAuContexte(secondeQuestion)
                  .construis(),
              )
              .construis(),
            transcripteurMultipleTiroir,
          );

          expect(
            representationDiagnostic.referentiel['contexte'].questions,
          ).toStrictEqual(
            resultatsAttendus([premiereQuestion, secondeQuestion]),
          );
        });

        it('avec les questions telles que décrites dans le référentiel sans transcripteur spécifique', () => {
          const question = uneQuestion()
            .aChoixUnique('Une question à choix unique ?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixUnique('Une question tiroir à choix unique?')
                    .construis(),
                )
                .construis(),
            ])
            .construis();

          const representationDiagnostic = representeLeDiagnosticPourLeClient(
            unDiagnostic()
              .avecUnReferentiel(
                unReferentiel()
                  .ajouteUneQuestionAuContexte(question)
                  .construis(),
              )
              .construis(),
            fabriqueTranscripteurVide(),
          );

          expect(
            representationDiagnostic.referentiel.contexte.questions[0],
          ).toStrictEqual<
            | RepresentationQuestionChoixUnique
            | RepresentationQuestionChoixMultiple
          >(resultatAttendu(question));
        });
      });
    });
  });

  const resultatsAttendus = <T>(
    questions: (QuestionChoixUnique | QuestionChoixMultiple)[],
  ): T[] => {
    return questions.map((q) => resultatAttendu(q));
  };
  const resultatAttendu = <T>(
    question: QuestionChoixUnique | QuestionChoixMultiple,
  ): T => {
    return {
      identifiant: question.identifiant,
      libelle: question.libelle,
      reponseDonnee: { reponses: [], valeur: null },
      reponsesPossibles: question.reponsesPossibles.map((rep) => {
        const questions: RepresentationQuestionTiroir[] =
          rep.questions?.map((q) => {
            return {
              identifiant: q.identifiant,
              libelle: q.libelle,
              reponsesPossibles: q.reponsesPossibles.map((r) => {
                return {
                  identifiant: r.identifiant,
                  libelle: r.libelle,
                  ordre: r.ordre,
                };
              }),
              type: q.type,
            };
          }) || [];
        return {
          identifiant: rep.identifiant,
          libelle: rep.libelle,
          ordre: rep.ordre,
          questions: questions,
        };
      }),
      type: question.type,
    } as T;
  };

  describe('Afin de représenter toutes les thématiques du diagnostic', () => {
    const expectThematique = (
      representationDiagnostic: RepresentationDiagnostic,
      nomThematique: string,
      question: Question,
      reponsePossible: ReponsePossible,
      diagnostic: Diagnostic,
    ) => {
      expect(representationDiagnostic.referentiel[nomThematique]).toStrictEqual(
        {
          questions: [
            {
              identifiant: question.identifiant,
              libelle: question.libelle,
              reponseDonnee: {
                valeur: null,
                reponses: [],
              },
              reponsesPossibles: [
                {
                  identifiant: reponsePossible.identifiant,
                  libelle: reponsePossible.libelle,
                  ordre: reponsePossible.ordre,
                },
              ],
              type: 'choixUnique',
            },
          ],
          actions: [
            {
              action: 'repondre',
              chemin: nomThematique,
              ressource: {
                url: `/api/diagnostic/${diagnostic.identifiant}`,
                methode: 'PATCH',
              },
            },
          ],
        },
      );
    };

    it('présente les différentes thématiques', () => {
      const questionTheme1 = uneQuestion().construis();
      const questionTheme2 = uneQuestion().construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielSansThematiques()
            .ajouteUneThematique('theme 1', [questionTheme1])
            .ajouteUneThematique('theme 2', [questionTheme2])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      const reponsePossibleQuestionTheme1 = questionTheme1.reponsesPossibles[0];
      const reponsePossibleQuestionTheme2 = questionTheme2.reponsesPossibles[0];
      expectThematique(
        representationDiagnostic,
        'theme 1',
        questionTheme1,
        reponsePossibleQuestionTheme1,
        diagnostic,
      );
      expectThematique(
        representationDiagnostic,
        'theme 2',
        questionTheme2,
        reponsePossibleQuestionTheme2,
        diagnostic,
      );
    });

    it('ordonne les différentes thématiques', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielSansThematiques()
            .ajouteUneThematique('b-3', [])
            .ajouteUneThematique('c-1', [])
            .ajouteUneThematique('a-2', [])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurThematiquesOrdonnees(['c-1', 'a-2', 'b-3']),
      );

      expect(Object.keys(representationDiagnostic.referentiel)).toStrictEqual([
        'c-1',
        'a-2',
        'b-3',
      ]);
    });
  });

  describe('Afin de prendre en compte les réponses données par l’utilisateur', () => {
    it('présente les réponses multiples pour les QCM', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('multiple', [
              uneQuestion()
                .aChoixMultiple('Ma question ?')
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle('rep1').construis(),
                  uneReponsePossible().avecLibelle('rep2').construis(),
                  uneReponsePossible().avecLibelle('rep3').construis(),
                ])
                .construis(),
            ])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'multiple',
            question: 'ma-question-',
          },
          uneNouvelleReponseDonnee()
            .reponseMultipleSansIdentifiant([
              { identifiant: 'ma-question-', reponses: ['rep1', 'rep3'] },
            ])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      const reponse =
        representationDiagnostic.referentiel['multiple'].questions[0]
          .reponseDonnee;
      expect(reponse).toStrictEqual({
        valeur: null,
        reponses: [{ identifiant: 'ma-question-', reponses: ['rep1', 'rep3'] }],
      });
    });

    it('présente les réponses multiples pour les questions à tiroir', () => {
      const premiereReponse = uneReponsePossible()
        .avecLibelle('rep 11')
        .construis();
      const deuxiemeReponse = uneReponsePossible()
        .avecLibelle('rep 12')
        .construis();
      const troisiemeReponse = uneReponsePossible()
        .avecLibelle('rep 21')
        .construis();
      const reponsePossible = uneReponsePossible()
        .avecLibelle('Réponse')
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixMultiple('q1')
            .avecReponsesPossibles([premiereReponse, deuxiemeReponse])
            .construis(),
        )
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .aChoixUnique('q2')
            .avecReponsesPossibles([troisiemeReponse])
            .construis(),
        )
        .construis();
      const question = uneQuestion()
        .aChoixUnique('question')
        .avecReponsesPossibles([reponsePossible])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel().ajouteUneQuestionAuContexte(question).construis(),
        )
        .ajouteUneReponseDonnee(
          { thematique: 'contexte', question: 'question' },
          uneNouvelleReponseDonnee()
            .reponseMultiple('réponse', [
              {
                identifiant: 'q1',
                reponses: [
                  premiereReponse.identifiant,
                  deuxiemeReponse.identifiant,
                ],
              },
              { identifiant: 'q2', reponses: [troisiemeReponse.identifiant] },
            ])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      const reponseDonnee =
        representationDiagnostic.referentiel['contexte'].questions[0]
          .reponseDonnee;
      expect(reponseDonnee).toStrictEqual({
        valeur: 'réponse',
        reponses: [
          { identifiant: 'q1', reponses: ['rep-11', 'rep-12'] },
          { identifiant: 'q2', reponses: ['rep-21'] },
        ],
      });
    });

    it('représente les réponses uniques', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Question unique?', [
                  uneReponsePossible()
                    .avecLibelle('Réponse unique')
                    .construis(),
                ])
                .construis(),
            )
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'contexte',
            question: 'question-unique',
          },
          uneNouvelleReponseDonnee()
            .reponseSimple('reponse-unique')
            .construis(),
        )
        .construis();
      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      const reponseDonnee =
        representationDiagnostic.referentiel['contexte'].questions[0]
          .reponseDonnee;
      expect(reponseDonnee).toStrictEqual({
        valeur: 'reponse-unique',
        reponses: [],
      });
    });

    it('représente les réponses libres', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique('Question libre?', [
                  uneReponsePossible().avecLibelle('Réponse libre').construis(),
                ])
                .construis(),
            )
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: 'contexte',
            question: 'question-libre',
          },
          uneNouvelleReponseDonnee()
            .reponseLibre('reponse-libre', 'Ma réponse')
            .construis(),
        )
        .construis();
      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      const reponseDonnee =
        representationDiagnostic.referentiel['contexte'].questions[0]
          .reponseDonnee;
      expect(reponseDonnee).toStrictEqual({
        valeur: 'reponse-libre',
        reponses: ['Ma réponse'],
      });
    });
  });
});
