import { describe, expect } from "vitest";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentielAuContexteVide,
} from "../../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../../constructeurs/constructeurDiagnostic";
import { representeLeDiagnosticPourLeClient } from "../../../src/api/representateurs/representateurDiagnostic";
import {
  transcripteurAvecSaisiesLibres,
  transcripteurQuestionTiroir,
} from "./transcripteursDeTest";

describe("Le représentateur de diagnostic", () => {
  it("définit le type de saisie que doit faire l'utilisateur", () => {
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentielAuContexteVide()
          .ajouteUneQuestionAuContexte(
            uneQuestion()
              .aChoixUnique("Quelle est la question?", [
                { identifiant: "reponse1", libelle: "réponse 1" },
                { identifiant: "reponse2", libelle: "réponse 2" },
                { identifiant: "reponse3", libelle: "réponse 3" },
              ])
              .construis(),
          )
          .construis(),
      )
      .construis();

    const diagnosticRepresente = representeLeDiagnosticPourLeClient(
      diagnostic,
      transcripteurAvecSaisiesLibres,
    );

    const reponsesPossibles =
      diagnosticRepresente.referentiel.contexte.questions[0].reponsesPossibles;
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
            uneQuestion()
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
        ).toStrictEqual([
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
                      ordre: reponse.ordre,
                      type: undefined,
                      question: undefined,
                    },
                  ],
                  type: "choixMultiple",
                },
                type: undefined,
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
                      uneQuestion()
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
        expect(questionTiroir?.question?.reponsesPossibles[2]).toStrictEqual({
          identifiant: "reponse-3",
          libelle: "Réponse 3",
          ordre: reponse3.ordre,
          type: { type: "saisieLibre", format: "texte" },
          question: undefined,
        });
      });

      it("avec plusieurs questions", () => {
        const reponse3 = uneReponsePossible()
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
                        uneQuestion()
                          .aChoixMultiple("Question tiroir?")
                          .avecReponsesPossibles([reponse3])
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
        expect(questionTiroir?.reponsesPossibles[0]).toStrictEqual({
          identifiant: "reponse-3",
          libelle: "Réponse 3",
          ordre: reponse3.ordre,
          type: { type: "saisieLibre", format: "texte" },
          question: undefined,
        });
      });
    });
  });
});
