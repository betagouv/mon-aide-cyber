import { describe, expect } from "vitest";
import { unTableauDeNotes } from "../constructeurs/constructeurTableauDeNotes";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";
import {
  unDiagnostic,
  uneReponseDonnee,
} from "../constructeurs/constructeurDiagnostic";
import {
  uneListeDeQuestions,
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import { genereLesRecommandations } from "../../src/diagnostic/Diagnostic";

describe("Diagnostic", () => {
  const tableauDeNotes = unTableauDeNotes()
    .avecDesNotes([
      {
        q1: {
          "reponse-11": 0,
          "reponse-12": 1,
          "reponse-13": null,
          "reponse-14": undefined,
        },
      },
      {
        q2: {
          "reponse-21": 0,
          "reponse-22": 1,
          "reponse-23": null,
          "reponse-24": undefined,
        },
      },
      {
        q3: {
          "reponse-31": 0,
          "reponse-32": 1,
          "reponse-33": null,
          "reponse-34": undefined,
        },
      },
      {
        q4: {
          "reponse-41": 0,
          "reponse-42": 1,
          "reponse-43": null,
          "reponse-44": undefined,
        },
      },
      {
        q5: {
          "reponse-51": 0,
          "reponse-52": 1,
          "reponse-53": null,
          "reponse-54": undefined,
        },
      },
      {
        q6: {
          "reponse-61": 0,
          "reponse-62": 1,
          "reponse-63": null,
          "reponse-64": undefined,
        },
      },
      {
        q7: {
          "reponse-71": 0,
          "reponse-72": 1,
          "reponse-73": null,
          "reponse-74": undefined,
        },
      },
    ])
    .construis();
  const tableauDeRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      { q1: { niveau1: "reco 1", niveau2: "reco 12", priorisation: 1 } },
      { q2: { niveau1: "reco 2", niveau2: "reco 22", priorisation: 2 } },
      { q3: { niveau1: "reco 3", niveau2: "reco 32", priorisation: 3 } },
      { q4: { niveau1: "reco 4", niveau2: "reco 42", priorisation: 4 } },
      { q5: { niveau1: "reco 5", niveau2: "reco 52", priorisation: 5 } },
      { q6: { niveau1: "reco 6", niveau2: "reco 62", priorisation: 6 } },
      { q7: { niveau1: "reco 7", niveau2: "reco 72", priorisation: 7 } },
    ])
    .construis();
  const questions = uneListeDeQuestions()
    .dontLesLabelsSont(["q1", "q2", "q3", "q4", "q5", "q6", "q7"])
    .avecLesReponsesPossiblesSuivantes([
      ["reponse 11", "reponse 12", "reponse 13", "reponse 14"],
      ["reponse 21", "reponse 22", "reponse 23", "reponse 24"],
      ["reponse 31", "reponse 32", "reponse 33", "reponse 34"],
      ["reponse 41", "reponse 42", "reponse 43", "reponse 44"],
      ["reponse 51", "reponse 52", "reponse 53", "reponse 54"],
      ["reponse 61", "reponse 62", "reponse 63", "reponse 64"],
      ["reponse 71", "reponse 72", "reponse 73", "reponse 74"],
    ])
    .construis();

  describe("lorsque l'on génère les recommandations", () => {
    describe("en ce qui concerne les différents niveaux de recommandations", () => {
      it("prend en compte la note de la réponse pour choisir entre le niveau 1 ou le niveau 2 des recommandations", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique("thematique", questions)
              .construis(),
          )
          .avecLesReponsesDonnees("thematique", [
            { q1: "reponse-11" },
            { q2: "reponse-22" },
            { q3: "reponse-31" },
            { q4: "reponse-41" },
            { q5: "reponse-52" },
            { q6: "reponse-61" },
            { q7: "reponse-72" },
          ])
          .avecUnTableauDeNotes(tableauDeNotes)
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        const partieCommuneAttendue = {
          noteObtenue: 0,
          pourquoi: "parce-que",
          comment: "comme ça",
        };
        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            priorisation: 1,
            titre: "reco 1",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 3,
            titre: "reco 3",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 4,
            titre: "reco 4",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 6,
            titre: "reco 6",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 2,
            titre: "reco 22",

            ...partieCommuneAttendue,
            noteObtenue: 1,
          },
          {
            priorisation: 5,
            titre: "reco 52",
            ...partieCommuneAttendue,
            noteObtenue: 1,
          },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [
            {
              priorisation: 7,
              titre: "reco 72",
              ...partieCommuneAttendue,
              noteObtenue: 1,
            },
          ],
        );
      });

      it("le niveau 2 est optionnel", () => {
        const tableauDeNotes = unTableauDeNotes().avecDesNotes([
          { q8: { "reponse-81": 0, "reponse-82": 1, "reponse-83": null } },
        ]);
        const tableauDeRecommandations =
          unTableauDeRecommandations().avecLesRecommandations([
            { q8: { niveau1: "reco 8", priorisation: 7 } },
          ]);
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique("thematique", [
                uneQuestion()
                  .aChoixUnique("q8")
                  .avecReponsesPossibles([
                    uneReponsePossible().avecLibelle("Réponse 81").construis(),
                    uneReponsePossible().avecLibelle("Réponse 82").construis(),
                    uneReponsePossible().avecLibelle("Réponse 83").construis(),
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .avecLesReponsesDonnees("thematique", [{ q8: "reponse-82" }])
          .avecUnTableauDeNotes(tableauDeNotes.construis())
          .avecUnTableauDeRecommandations(tableauDeRecommandations.construis())
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            comment: "comme ça",
            noteObtenue: 1,
            pourquoi: "parce-que",
            priorisation: 7,
            titre: "reco 8",
          },
        ]);
      });
    });

    it("prend en compte les questions ne donnant pas lieu à une recommandation", () => {
      const questionContexte = uneQuestion()
        .aChoixUnique("qc")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("qc").construis(),
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneThematique("thematique", questions)
            .ajouteUneQuestionAuContexte(questionContexte)
            .construis(),
        )
        .avecLesReponsesDonnees("contexte", [{ qc: "rqc" }])
        .avecLesReponsesDonnees("thematique", [
          { q1: "reponse-13" },
          { q2: "reponse-22" },
          { q3: "reponse-31" },
          { q4: "reponse-44" },
          { q5: "reponse-52" },
          { q6: "reponse-61" },
          { q7: "reponse-72" },
        ])
        .avecUnTableauDeNotes(tableauDeNotes)
        .avecUnTableauDeRecommandations(tableauDeRecommandations)
        .construis();

      genereLesRecommandations(diagnostic);

      const partieCommuneAttendue = {
        noteObtenue: 1,
        pourquoi: "parce-que",
        comment: "comme ça",
      };
      expect(
        diagnostic.recommandations?.recommandationsPrioritaires,
      ).toStrictEqual([
        {
          ...partieCommuneAttendue,
          noteObtenue: 0,
          priorisation: 3,
          titre: "reco 3",
        },
        {
          ...partieCommuneAttendue,
          noteObtenue: 0,
          priorisation: 6,
          titre: "reco 6",
        },
        {
          ...partieCommuneAttendue,
          priorisation: 2,
          titre: "reco 22",
        },
        {
          ...partieCommuneAttendue,
          priorisation: 5,
          titre: "reco 52",
        },
        {
          ...partieCommuneAttendue,
          priorisation: 7,
          titre: "reco 72",
        },
      ]);
      expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
        [],
      );
    });

    describe("trie le resultat", () => {
      const tableauDeRecommandations = unTableauDeRecommandations()
        .avecLesRecommandations([
          { q1: { niveau1: "reco 1", niveau2: "reco 12", priorisation: 3 } },
          { q2: { niveau1: "reco 2", niveau2: "reco 22", priorisation: 2 } },
          { q3: { niveau1: "reco 3", niveau2: "reco 32", priorisation: 4 } },
          { q4: { niveau1: "reco 4", niveau2: "reco 42", priorisation: 1 } },
          { q5: { niveau1: "reco 5", niveau2: "reco 52", priorisation: 7 } },
          { q6: { niveau1: "reco 6", niveau2: "reco 62", priorisation: 5 } },
          { q7: { niveau1: "reco 7", niveau2: "reco 72", priorisation: 6 } },
          { q8: { niveau1: "reco 8", niveau2: "reco 82", priorisation: 8 } },
          { q9: { niveau1: "reco 9", niveau2: "reco 92", priorisation: 9 } },
        ])
        .construis();

      it("en prenant en compte le niveau de priorisation de la recommandation", () => {
        const questionsSupplementaires = uneListeDeQuestions()
          .dontLesLabelsSont(["q8", "q9"])
          .avecLesReponsesPossiblesSuivantes([
            ["reponse 81", "reponse 82"],
            ["reponse 91", "reponse 92"],
          ])
          .construis();
        const autreTableauDeNotes = unTableauDeNotes()
          .avecDesNotes([
            {
              q8: {
                "reponse-81": 0,
                "reponse-82": 1,
              },
              q9: {
                "reponse-91": 0,
                "reponse-92": 1,
              },
            },
          ])
          .construis();
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique("thematique", [
                ...questions,
                ...questionsSupplementaires,
              ])
              .construis(),
          )
          .avecLesReponsesDonnees("contexte", [{ qc: "rqc" }])
          .avecLesReponsesDonnees("thematique", [
            { q2: "reponse-23" },
            { q1: "reponse-11" },
            { q4: "reponse-41" },
            { q3: "reponse-34" },
            { q6: "reponse-61" },
            { q5: "reponse-52" },
            { q7: "reponse-71" },
            { q8: "reponse-81" },
            { q9: "reponse-92" },
          ])
          .avecUnTableauDeNotes({ ...tableauDeNotes, ...autreTableauDeNotes })
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        const partieCommuneAttendue = {
          noteObtenue: 0,
          pourquoi: "parce-que",
          comment: "comme ça",
        };
        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            priorisation: 1,
            titre: "reco 4",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 3,
            titre: "reco 1",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 5,
            titre: "reco 6",
            ...partieCommuneAttendue,
          },
          {
            priorisation: 6,
            titre: "reco 7",
            ...partieCommuneAttendue,
          },
          {
            ...partieCommuneAttendue,
            priorisation: 8,
            titre: "reco 8",
          },
          {
            ...partieCommuneAttendue,
            noteObtenue: 1,
            priorisation: 7,
            titre: "reco 52",
          },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [
            {
              ...partieCommuneAttendue,
              noteObtenue: 1,
              priorisation: 9,
              titre: "reco 92",
            },
          ],
        );
      });
    });

    describe("pour des questions dont le résultat dépend d'une règle de calcul", () => {
      const tableauDeNotes = unTableauDeNotes()
        .avecDesNotes([
          {
            q1: {
              "reponse-1": 0,
              "reponse-2": 1,
              "reponse-3": {
                operation: "moyenne",
                reponses: {
                  "reponse-310": null,
                  "reponse-311": 1,
                  "reponse-312": 3,
                  "reponse-320": null,
                  "reponse-321": 1.5,
                  "reponse-322": 2,
                  "reponse-330": null,
                  "reponse-331": 0,
                  "reponse-332": 3,
                },
              },
            },
          },
        ])
        .construis();
      const tableauDeRecommandations = unTableauDeRecommandations()
        .avecLesRecommandations([
          { q1: { niveau1: "reco 1", niveau2: "reco 12", priorisation: 1 } },
        ])
        .construis();
      const question = uneQuestion()
        .aChoixUnique("q1")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("Réponse 1").construis(),
          uneReponsePossible().avecLibelle("Réponse 2").construis(),
          uneReponsePossible()
            .avecLibelle("Réponse 3")
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique("Question 31")
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle("Réponse 311").construis(),
                  uneReponsePossible().avecLibelle("Réponse 312").construis(),
                ])
                .construis(),
            )
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique("Question 32")
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle("Réponse 321").construis(),
                  uneReponsePossible().avecLibelle("Réponse 322").construis(),
                ])
                .construis(),
            )
            .ajouteUneQuestionATiroir(
              uneQuestionATiroir()
                .aChoixUnique("Réponse 33")
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle("Réponse 331").construis(),
                  uneReponsePossible().avecLibelle("Réponse 332").construis(),
                ])
                .construis(),
            )
            .construis(),
        ])
        .construis();

      it("prend en compte la règle de la moyenne", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique("multiple", [question])
              .construis(),
          )
          .ajouteUneReponseDonnee(
            { thematique: "multiple", question: "q1" },
            uneReponseDonnee()
              .ayantPourReponse("reponse-3")
              .avecDesReponsesMultilpes([
                {
                  identifiant: "question-31",
                  reponses: ["reponse-311"],
                },
                {
                  identifiant: "question-32",
                  reponses: ["reponse-322"],
                },
                {
                  identifiant: "question-33",
                  reponses: ["reponse-332"],
                },
              ])
              .construis(),
          )
          .avecUnTableauDeNotes(tableauDeNotes)
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          {
            noteObtenue: 2,
            priorisation: 1,
            titre: "reco 12",
            pourquoi: "parce-que",
            comment: "comme ça",
          },
        ]);
      });

      it("prend en compte les réponses aux questions ne donnant pas lieu à une recommandation", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique("multiple", [question])
              .construis(),
          )
          .ajouteUneReponseDonnee(
            { thematique: "multiple", question: "q1" },
            uneReponseDonnee()
              .ayantPourReponse("reponse-3")
              .avecDesReponsesMultilpes([
                {
                  identifiant: "question-31",
                  reponses: ["reponse-310"],
                },
                {
                  identifiant: "question-32",
                  reponses: ["reponse-320"],
                },
                {
                  identifiant: "question-33",
                  reponses: ["reponse-330"],
                },
              ])
              .construis(),
          )
          .avecUnTableauDeNotes(tableauDeNotes)
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [],
        );
      });
    });
  });
});
