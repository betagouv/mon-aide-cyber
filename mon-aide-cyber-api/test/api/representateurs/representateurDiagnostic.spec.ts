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
  uneReponseDonnee,
} from '../../constructeurs/constructeurDiagnostic';
import { representeLeDiagnosticPourLeClient } from '../../../src/api/representateurs/representateurDiagnostic';
import {
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
  unTranscripteur,
} from './transcripteursDeTest';
import { Question, ReponsePossible } from '../../../src/diagnostic/Referentiel';
import {
  RepresentationDiagnostic,
  RepresentationGroupes,
  RepresentationThematique,
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
        representationDiagnostic.referentiel.contexte.actions[0],
      ).toStrictEqual({
        action: 'repondre',
        chemin: 'contexte',
        ressource: {
          url: `/api/diagnostic/${diagnostic.identifiant}`,
          methode: 'PATCH',
        },
      });
      expect(representationDiagnostic.actions).toHaveLength(3);
      expect(representationDiagnostic.actions[2]).toStrictEqual({
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

    it("fournit l'action 'restituer' dans la réponse", () => {
      const diagnostic = unDiagnostic().construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      expect(representationDiagnostic.actions[1]).toStrictEqual({
        action: 'restituer',
        ressource: {
          url: `/api/diagnostic/${diagnostic.identifiant}/restitution`,
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
        diagnosticRepresente.referentiel['contexte'].groupes[0].questions[0]
          .reponseDonnee,
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
        diagnosticRepresente.referentiel.contexte.groupes[0].questions[0];
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
              description: 'Description du contexte',
              libelle: 'Contexte',
              localisationIconeNavigation: '/chemin/icone/contexte',
              localisationIllustration: '/chemin/illustration/contexte',
              groupes: [
                {
                  questions: [
                    {
                      identifiant: 'question-liste',
                      type: 'liste',
                      reponses: [],
                    },
                  ],
                },
              ],
            },
          },
        },
      );

      const question =
        diagnosticRepresente.referentiel.contexte.groupes[0].questions[0];
      expect(question.type).toBe('liste');
    });

    describe("Lorsqu'il contient des réponses avec des questions tiroirs", () => {
      describe('définit la manière dont est présentée la question et ses réponses', () => {
        it('avec une seule question et une seule réponse', () => {
          const reponse = uneReponsePossible()
            .avecLibelle('Réponse 1')
            .construis();
          const reponsePossible = uneReponsePossible()
            .avecLibelle('Réponse 0')
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixMultiple('Question tiroir?')
                .avecReponsesPossibles([reponse])
                .construis(),
            )
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
                    .aChoixUnique('Question avec réponse tiroir?')
                    .avecReponsesPossibles([reponsePossible])
                    .construis(),
                )
                .construis(),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          expect(
            diagnosticRepresente.referentiel.contexte.groupes.flatMap(
              (q) => q.questions,
            ),
          ).toMatchObject([
            {
              identifiant: 'question-avec-reponse-tiroir',
              libelle: 'Question avec réponse tiroir?',
              reponsesPossibles: [
                {
                  identifiant: 'reponse-0',
                  libelle: 'Réponse 0',
                  ordre: reponsePossible.ordre,
                  questions: [
                    {
                      identifiant: 'question-tiroir',
                      libelle: 'Question tiroir?',
                      reponsesPossibles: [
                        {
                          identifiant: 'reponse-1',
                          libelle: 'Réponse 1',
                          ordre: 0,
                        },
                      ],
                      type: 'choixMultiple',
                    },
                  ],
                },
              ],
              type: 'choixUnique',
            },
          ]);
        });

        it('avec une seule question et plusieurs réponses', () => {
          const reponse3 = uneReponsePossible()
            .avecLibelle('Réponse 3')
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
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
            diagnosticRepresente.referentiel.contexte.groupes[0].questions[0]
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
          ).toMatchObject({
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
            diagnosticRepresente.referentiel.contexte.groupes[0].questions[0]
              .reponsesPossibles[0]?.questions?.[0];
          expect(questionTiroir?.reponsesPossibles[0]).toMatchObject({
            identifiant: 'reponse-3',
            libelle: 'Réponse 3',
            ordre: 0,
            type: { type: 'saisieLibre', format: 'texte' },
          });
        });
        it('avec plusieurs questions à tiroir', () => {
          const reponse1 = uneReponsePossible()
            .avecLibelle('Réponse 11')
            .construis();
          const reponse2 = uneReponsePossible()
            .avecLibelle('Réponse 21')
            .construis();
          const premiereQuestion = uneQuestion()
            .aChoixUnique('Première question?')
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle('Réponse 1')
                .ajouteUneQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple('Question 11')
                    .avecReponsesPossibles([reponse1])
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
                    .avecReponsesPossibles([reponse2])
                    .construis(),
                )
                .construis(),
            ])
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneQuestionAuContexte(premiereQuestion)
                .ajouteUneQuestionAuContexte(secondeQuestion)
                .construis(),
            )
            .construis();

          const representationDiagnostic = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurMultipleTiroir,
          );

          const premiereQuestionTiroir =
            representationDiagnostic.referentiel.contexte.groupes[0]
              .questions[0].reponsesPossibles[0]?.questions?.[0];
          expect(premiereQuestionTiroir?.reponsesPossibles[0]).toMatchObject({
            identifiant: 'reponse-11',
            libelle: 'Réponse 11',
            ordre: 0,
          });
          const deuxiemeQuestionTiroir =
            representationDiagnostic.referentiel.contexte.groupes[0]
              .questions[1].reponsesPossibles[0]?.questions?.[0];
          expect(
            deuxiemeQuestionTiroir?.reponsesPossibles[0],
          ).toStrictEqual<ReponsePossible>({
            identifiant: 'reponse-21',
            libelle: 'Réponse 21',
            ordre: 0,
          });
        });

        it('avec les questions telles que décrites dans le référentiel sans transcripteur spécifique', () => {
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentiel()
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
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
                    .construis(),
                )
                .construis(),
            )
            .construis();

          const representationDiagnostic = representeLeDiagnosticPourLeClient(
            diagnostic,
            fabriqueTranscripteurVide(),
          );

          const question =
            representationDiagnostic.referentiel.contexte.groupes[0]
              .questions[0];
          expect(question).toMatchObject({
            identifiant: 'une-question-a-choix-unique-',
            libelle: 'Une question à choix unique ?',
            type: 'choixUnique',
          });
          expect(question.reponsesPossibles[0].questions?.[0]).toMatchObject({
            identifiant: 'une-question-tiroir-a-choix-unique',
            libelle: 'Une question tiroir à choix unique?',
            type: 'choixUnique',
          });
        });
      });
    });
  });

  describe('Afin de représenter toutes les thématiques du diagnostic', () => {
    const expectThematique = (
      representationDiagnostic: RepresentationDiagnostic,
      nomThematique: string,
      question: Question,
      reponsePossible: ReponsePossible,
      diagnostic: Diagnostic,
      description: string,
      numero = 1,
    ) => {
      expect(
        representationDiagnostic.referentiel[nomThematique],
      ).toStrictEqual<RepresentationThematique>({
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
        description,
        libelle: nomThematique,
        localisationIllustration: `/chemin/illustration/${nomThematique}`,
        localisationIconeNavigation: `/chemin/icone/${nomThematique}`,
        groupes: [
          {
            numero,
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
          },
        ],
      });
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

      const transcripteur = unTranscripteur()
        .avecLesThematiques(['theme 1', 'theme 2'])
        .ordonneLesThematiques(['theme 1', 'theme 2'])
        .construis();
      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        transcripteur,
      );

      const reponsePossibleQuestionTheme1 = questionTheme1.reponsesPossibles[0];
      const reponsePossibleQuestionTheme2 = questionTheme2.reponsesPossibles[0];
      expectThematique(
        representationDiagnostic,
        'theme 1',
        questionTheme1,
        reponsePossibleQuestionTheme1,
        diagnostic,
        transcripteur.thematiques['theme 1'].description,
      );
      expectThematique(
        representationDiagnostic,
        'theme 2',
        questionTheme2,
        reponsePossibleQuestionTheme2,
        diagnostic,
        transcripteur.thematiques['theme 2'].description,
        2,
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
        unTranscripteur()
          .avecLesThematiques(['a-2', 'b-3', 'c-1'])
          .ordonneLesThematiques(['c-1', 'a-2', 'b-3'])
          .construis(),
      );

      expect(Object.keys(representationDiagnostic.referentiel)).toStrictEqual([
        'c-1',
        'a-2',
        'b-3',
      ]);
    });

    it('offre une description des thématiques', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielSansThematiques()
            .ajouteUneThematique('thematique-1', [])
            .ajouteUneThematique('thematique-2', [])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        unTranscripteur()
          .avecLesThematiques(['thematique-1', 'thematique-2'])
          .avecLesDescriptions([
            {
              thematique: 'thematique-1',
              description: 'Description thématique 1',
            },
            {
              thematique: 'thematique-2',
              description: 'Description thématique 2',
            },
          ])
          .construis(),
      );

      expect(
        Object.entries(representationDiagnostic.referentiel).map(
          ([, thematique]) => thematique.description,
        ),
      ).toStrictEqual(['Description thématique 2', 'Description thématique 1']);
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
          uneReponseDonnee()
            .avecDesReponsesMultiples([
              { identifiant: 'ma-question-', reponses: ['rep1', 'rep3'] },
            ])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        unTranscripteur().avecLesThematiques(['multiple']).construis(),
      );

      const reponse =
        representationDiagnostic.referentiel['multiple'].groupes[0].questions[0]
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
          uneReponseDonnee()
            .ayantPourReponse('réponse')
            .avecDesReponsesMultiples([
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
        representationDiagnostic.referentiel['contexte'].groupes[0].questions[0]
          .reponseDonnee;
      expect(reponseDonnee).toStrictEqual({
        valeur: 'réponse',
        reponses: [
          { identifiant: 'q1', reponses: ['rep-11', 'rep-12'] },
          { identifiant: 'q2', reponses: ['rep-21'] },
        ],
      });
    });
  });

  describe('Afin de représenter les questions de manière groupées', () => {
    it('groupe les questions pour une thématique', () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('thematique-groupee', [
              uneQuestion()
                .aChoixUnique('Quelle est la nature de votre entité?')
                .construis(),
              uneQuestion()
                .aChoixUnique("Quel est son secteur d'activité?")
                .construis(),
              uneQuestion()
                .aChoixUnique('Combien de personnes compte votre entité?')
                .construis(),
            ])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        unTranscripteur()
          .avecLesThematiques(['thematique-groupee'])
          .avecLesQuestionsGroupees([
            {
              thematique: 'thematique-groupee',
              groupes: [
                {
                  questions: [
                    { identifiant: 'quelle-est-la-nature-de-votre-entite' },
                    { identifiant: 'quel-est-son-secteur-dactivite' },
                  ],
                },
                {
                  questions: [
                    { identifiant: 'combien-de-personnes-compte-votre-entite' },
                  ],
                },
              ],
            },
          ])
          .construis(),
      );

      expect(
        representationDiagnostic.referentiel['thematique-groupee'].groupes,
      ).toStrictEqual([
        {
          numero: 1,
          questions: [
            {
              type: 'choixUnique',
              identifiant: 'quelle-est-la-nature-de-votre-entite',
              libelle: 'Quelle est la nature de votre entité?',
              reponseDonnee: { valeur: null, reponses: [] },
              reponsesPossibles: [],
            },
            {
              type: 'choixUnique',
              identifiant: 'quel-est-son-secteur-dactivite',
              libelle: "Quel est son secteur d'activité?",
              reponseDonnee: { valeur: null, reponses: [] },
              reponsesPossibles: [],
            },
          ],
        },
        {
          numero: 2,
          questions: [
            {
              type: 'choixUnique',
              identifiant: 'combien-de-personnes-compte-votre-entite',
              libelle: 'Combien de personnes compte votre entité?',
              reponseDonnee: { valeur: null, reponses: [] },
              reponsesPossibles: [],
            },
          ],
        },
      ]);
    });

    it("conserve l'ordre des thématiques", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique('seconde-thematique', [
              uneQuestion()
                .aChoixUnique('Existe-t-il un schéma à jour?')
                .construis(),
            ])
            .ajouteUneThematique('premiere-thematique', [
              uneQuestion()
                .aChoixUnique('Quelle est la nature de votre entité?')
                .construis(),
            ])
            .construis(),
        )
        .construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        unTranscripteur()
          .avecLesThematiques(['premiere-thematique', 'seconde-thematique'])
          .ordonneLesThematiques(['premiere-thematique', 'seconde-thematique'])
          .construis(),
      );

      expect(
        representationDiagnostic.referentiel['premiere-thematique'].groupes,
      ).toStrictEqual<RepresentationGroupes>([
        {
          numero: 1,
          questions: [
            {
              identifiant: 'quelle-est-la-nature-de-votre-entite',
              libelle: 'Quelle est la nature de votre entité?',
              reponseDonnee: { valeur: null, reponses: [] },
              reponsesPossibles: [],
              type: 'choixUnique',
            },
          ],
        },
      ]);
      expect(
        representationDiagnostic.referentiel['seconde-thematique'].groupes,
      ).toStrictEqual<RepresentationGroupes>([
        {
          numero: 2,
          questions: [
            {
              identifiant: 'existetil-un-schema-a-jour',
              libelle: 'Existe-t-il un schéma à jour?',
              reponseDonnee: { valeur: null, reponses: [] },
              reponsesPossibles: [],
              type: 'choixUnique',
            },
          ],
        },
      ]);
    });
  });
});
