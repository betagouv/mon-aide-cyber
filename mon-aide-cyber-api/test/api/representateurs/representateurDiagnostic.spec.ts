import { describe, expect } from "vitest";
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponseComplementaire,
  uneReponsePossible,
  unReferentielAuContexteVide,
} from "../../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../../constructeurs/constructeurDiagnostic";
import { representeLeDiagnosticPourLeClient } from "../../../src/api/representateurs/representateurDiagnostic";
import {
  fabriqueTranscripteur,
  fabriqueTranscripteurVide,
  transcripteurAvecSaisiesLibres,
  TranscripteurDeQuestion,
  TranscripteurDeReponse,
  TranscripteurDeReponseComplementaire,
  transcripteurMultipleTiroir,
  transcripteurQuestionTiroir,
} from "./transcripteursDeTest";

describe("Le représentateur de diagnostic", () => {
  describe("Afin de fournir les actions possibles pour un client", () => {
    it("fournit l’action ’repondre’ dans la réponse", () => {
      const diagnostic = unDiagnostic().construis();

      const representationDiagnostic = representeLeDiagnosticPourLeClient(
        diagnostic,
        fabriqueTranscripteurVide(),
      );

      expect(
        representationDiagnostic.referentiel.contexte.actions,
      ).toStrictEqual([
        {
          action: "repondre",
          chemin: "contexte",
          ressource: {
            url: `/api/diagnostic/${diagnostic.identifiant}`,
            methode: "PATCH",
          },
        },
      ]);
    });
  });

  describe("Afin de représenter l’affichage de la saisie pour le client", () => {
    it("présente le format de réponse pour une question", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielAuContexteVide()
            .ajouteUneQuestionAuContexte(
              uneQuestion().aChoixUnique("Des réponses?").construis(),
            )
            .construis(),
        )
        .construis();

      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        transcripteurAvecSaisiesLibres,
      );

      expect(
        diagnosticRepresente.referentiel["contexte"].questions[0].reponseDonnee,
      ).toStrictEqual({
        valeur: null,
        reponsesMultiples: [],
      });
    });
    it("définit le type de saisie que doit faire l'utilisateur", () => {
      const question = uneQuestion()
        .aChoixUnique("Quelle est la question?", [
          { identifiant: "reponse1", libelle: "réponse 1" },
          { identifiant: "reponse2", libelle: "réponse 2" },
          { identifiant: "reponse3", libelle: "réponse 3" },
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielAuContexteVide()
            .ajouteUneQuestionAuContexte(question)
            .construis(),
        )
        .construis();

      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        transcripteurAvecSaisiesLibres,
      );

      const questionRetournee =
        diagnosticRepresente.referentiel.contexte.questions[0];
      const reponsesPossibles = questionRetournee.reponsesPossibles;
      expect(questionRetournee.type).toBe("choixUnique");
      expect(reponsesPossibles[0].type).toStrictEqual({
        type: "saisieLibre",
        format: "texte",
      });
      expect(reponsesPossibles[1].type).toStrictEqual({
        type: "saisieLibre",
        format: "nombre",
      });
      expect(reponsesPossibles[2].type).toBeUndefined();
    });

    it("définit la manière dont est présentée la question sous forme de liste", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentielAuContexteVide()
            .ajouteUneQuestionAuContexte(
              uneQuestion().aChoixUnique("Question liste?").construis(),
            )
            .construis(),
        )
        .construis();
      const diagnosticRepresente = representeLeDiagnosticPourLeClient(
        diagnostic,
        {
          contexte: {
            questions: [
              { identifiant: "question-liste", type: "liste", reponses: [] },
            ],
          },
        },
      );

      const question = diagnosticRepresente.referentiel.contexte.questions[0];
      expect(question.type).toBe("liste");
    });

    describe("Lorsqu'il contient des réponses avec des questions tiroirs", () => {
      describe("définit la manière dont est présentée la question et ses réponses", () => {
        it("avec une seule question et une seule réponse", () => {
          const reponse = uneReponsePossible()
            .avecLibelle("Réponse 1")
            .construis();
          const reponsePossible = uneReponsePossible()
            .avecLibelle("Réponse 0")
            .avecQuestionATiroir(
              uneQuestionATiroir()
                .aChoixMultiple("Question tiroir?")
                .avecReponsesPossibles([reponse])
                .construis(),
            )
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentielAuContexteVide().ajouteUneQuestionAuContexte(
                uneQuestion()
                  .aChoixUnique("Question avec réponse tiroir?")
                  .avecReponsesPossibles([reponsePossible])
                  .construis(),
              ),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          expect(
            diagnosticRepresente.referentiel.contexte.questions,
          ).toMatchObject([
            {
              identifiant: "question-avec-reponse-tiroir",
              libelle: "Question avec réponse tiroir?",
              reponsesPossibles: [
                {
                  identifiant: "reponse-0",
                  libelle: "Réponse 0",
                  ordre: reponsePossible.ordre,
                  question: {
                    identifiant: "question-tiroir",
                    libelle: "Question tiroir?",
                    reponsesPossibles: [
                      {
                        identifiant: "reponse-1",
                        libelle: "Réponse 1",
                        ordre: 0,
                      },
                    ],
                    type: "choixMultiple",
                  },
                },
              ],
              type: "choixUnique",
            },
          ]);
        });

        it("avec une seule question et plusieurs réponses", () => {
          const reponse3 = uneReponsePossible()
            .avecLibelle("Réponse 3")
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentielAuContexteVide().ajouteUneQuestionAuContexte(
                uneQuestion()
                  .aChoixUnique("Question avec réponse tiroir?")
                  .avecReponsesPossibles([
                    uneReponsePossible()
                      .avecLibelle("Réponse 0")
                      .avecQuestionATiroir(
                        uneQuestionATiroir()
                          .aChoixMultiple("Question tiroir?")
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
              ),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          const questionTiroir =
            diagnosticRepresente.referentiel.contexte.questions[0]
              .reponsesPossibles[0];
          expect(questionTiroir?.question?.identifiant).toBe("question-tiroir");
          expect(questionTiroir?.question?.libelle).toBe("Question tiroir?");
          expect(questionTiroir?.question?.type).toBe("choixMultiple");
          expect(questionTiroir?.question?.reponsesPossibles[2]).toMatchObject({
            identifiant: "reponse-3",
            libelle: "Réponse 3",
            ordre: 2,
            type: { type: "saisieLibre", format: "texte" },
          });
        });

        it("avec plusieurs questions", () => {
          const reponse = uneReponsePossible()
            .avecLibelle("Réponse 3")
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentielAuContexteVide()
                .ajouteUneQuestionAuContexte(uneQuestion().construis())
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
                    .aChoixUnique("Question avec réponse tiroir?")
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .avecQuestionATiroir(
                          uneQuestionATiroir()
                            .aChoixMultiple("Question tiroir?")
                            .avecReponsesPossibles([reponse])
                            .construis(),
                        )
                        .construis(),
                    ])
                    .construis(),
                ),
            )
            .construis();

          const diagnosticRepresente = representeLeDiagnosticPourLeClient(
            diagnostic,
            transcripteurQuestionTiroir,
          );

          const questionTiroir =
            diagnosticRepresente.referentiel.contexte.questions[1]
              .reponsesPossibles[0]?.question;
          expect(questionTiroir?.reponsesPossibles[0]).toMatchObject({
            identifiant: "reponse-3",
            libelle: "Réponse 3",
            ordre: 0,
            type: { type: "saisieLibre", format: "texte" },
          });
        });
        it("avec plusieurs questions à tiroir", () => {
          const reponse1 = uneReponsePossible()
            .avecLibelle("Réponse 11")
            .construis();
          const reponse2 = uneReponsePossible()
            .avecLibelle("Réponse 21")
            .construis();
          const premiereQuestion = uneQuestion()
            .aChoixUnique("Première question?")
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle("Réponse 1")
                .avecQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple("Question 11")
                    .avecReponsesPossibles([reponse1])
                    .construis(),
                )
                .construis(),
            ])
            .construis();
          const secondeQuestion = uneQuestion()
            .aChoixUnique("Deuxième question?")
            .avecReponsesPossibles([
              uneReponsePossible()
                .avecLibelle("Réponse 2")
                .avecQuestionATiroir(
                  uneQuestionATiroir()
                    .aChoixMultiple("Question 21")
                    .avecReponsesPossibles([reponse2])
                    .construis(),
                )
                .construis(),
            ])
            .construis();
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentielAuContexteVide()
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
            representationDiagnostic.referentiel.contexte.questions[0]
              .reponsesPossibles[0]?.question;
          expect(premiereQuestionTiroir?.reponsesPossibles[0]).toMatchObject({
            identifiant: "reponse-11",
            libelle: "Réponse 11",
            ordre: 0,
          });
          const deuxiemeQuestionTiroir =
            representationDiagnostic.referentiel.contexte.questions[1]
              .reponsesPossibles[0]?.question;
          expect(deuxiemeQuestionTiroir?.reponsesPossibles[0]).toMatchObject({
            identifiant: "reponse-21",
            libelle: "Réponse 21",
            ordre: 0,
          });
        });

        it("avec les questions telles que décrites dans le référentiel sans transcripteur spécifique", () => {
          const diagnostic = unDiagnostic()
            .avecUnReferentiel(
              unReferentielAuContexteVide()
                .ajouteUneQuestionAuContexte(
                  uneQuestion()
                    .aChoixUnique("Une question à choix unique ?")
                    .avecReponsesPossibles([
                      uneReponsePossible()
                        .avecQuestionATiroir(
                          uneQuestionATiroir()
                            .aChoixUnique("Une question tiroir à choix unique?")
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
            representationDiagnostic.referentiel.contexte.questions[0];
          expect(question).toMatchObject({
            identifiant: "une-question-a-choix-unique-",
            libelle: "Une question à choix unique ?",
            type: "choixUnique",
          });
          expect(question.reponsesPossibles[0].question).toMatchObject({
            identifiant: "une-question-tiroir-a-choix-unique",
            libelle: "Une question tiroir à choix unique?",
            type: "choixUnique",
          });
        });
      });

      it("retourne les réponses complémentaires si il y en a", () => {
        const reponseComplementaire = uneReponseComplementaire().construis();
        const secondeReponseComplementaire =
          uneReponseComplementaire().construis();
        const reponsePossible = uneReponsePossible()
          .avecDesReponsesComplementaires([
            reponseComplementaire,
            secondeReponseComplementaire,
          ])
          .construis();
        const question = uneQuestion()
          .avecReponsesPossibles([reponsePossible])
          .construis();
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentielAuContexteVide()
              .ajouteUneQuestionAuContexte(question)
              .construis(),
          )
          .construis();

        const transcripteurs = new TranscripteurDeQuestion(
          question,
        ).ajouteUnTranscripteurDeReponse(
          new TranscripteurDeReponse(reponsePossible)
            .ajouteUnTranscripteurDeReponseComplementaire(
              new TranscripteurDeReponseComplementaire(
                secondeReponseComplementaire,
              ),
            )
            .ajouteUnTranscripteurDeReponseComplementaire(
              new TranscripteurDeReponseComplementaire(reponseComplementaire),
            ),
        );
        const representationDiagnostic = representeLeDiagnosticPourLeClient(
          diagnostic,
          fabriqueTranscripteur([transcripteurs]),
        );

        const questionRepresentee =
          representationDiagnostic.referentiel.contexte.questions[0];
        expect(
          questionRepresentee.reponsesPossibles[0]?.reponsesComplementaires?.[0]
            .libelle,
        ).toBe(reponseComplementaire.libelle);
        expect(
          questionRepresentee.reponsesPossibles[0]?.reponsesComplementaires?.[0]
            .type,
        ).toMatchObject({
          type: "saisieLibre",
          format: "texte",
        });
        expect(
          questionRepresentee.reponsesPossibles[0]?.reponsesComplementaires?.[1]
            .libelle,
        ).toBe(secondeReponseComplementaire.libelle);
        expect(
          questionRepresentee.reponsesPossibles[0]?.reponsesComplementaires?.[1]
            .type,
        ).toMatchObject({
          type: "saisieLibre",
          format: "texte",
        });
      });
    });
  });
});
