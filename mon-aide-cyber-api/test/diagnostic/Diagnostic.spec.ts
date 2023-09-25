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
      { q1: { "reponse-11": 0, "reponse-12": 1, "reponse-13": null } },
      { q2: { "reponse-21": 0, "reponse-22": 1, "reponse-23": null } },
      { q3: { "reponse-31": 0, "reponse-32": 1, "reponse-33": null } },
      { q4: { "reponse-41": 0, "reponse-42": 1, "reponse-43": null } },
      { q5: { "reponse-51": 0, "reponse-52": 1, "reponse-53": null } },
      { q6: { "reponse-61": 0, "reponse-62": 1, "reponse-63": null } },
      { q7: { "reponse-71": 0, "reponse-72": 1, "reponse-73": null } },
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

      expect(
        diagnostic.recommandations?.recommandationsPrioritaires,
      ).toStrictEqual([
        { recommandation: "reco 1", noteObtenue: 0, priorisation: 1 },
        { recommandation: "reco 3", noteObtenue: 0, priorisation: 3 },
        { recommandation: "reco 4", noteObtenue: 0, priorisation: 4 },
        { recommandation: "reco 6", noteObtenue: 0, priorisation: 6 },
        { recommandation: "reco 22", noteObtenue: 1, priorisation: 2 },
        { recommandation: "reco 52", noteObtenue: 1, priorisation: 5 },
      ]);
      expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual([
        { recommandation: "reco 72", noteObtenue: 1, priorisation: 7 },
      ]);
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
          { q4: "reponse-43" },
          { q5: "reponse-52" },
          { q6: "reponse-61" },
          { q7: "reponse-72" },
        ])
        .avecUnTableauDeNotes(tableauDeNotes)
        .avecUnTableauDeRecommandations(tableauDeRecommandations)
        .construis();

      genereLesRecommandations(diagnostic);

      expect(
        diagnostic.recommandations?.recommandationsPrioritaires,
      ).toStrictEqual([
        { recommandation: "reco 3", noteObtenue: 0, priorisation: 3 },
        { recommandation: "reco 6", noteObtenue: 0, priorisation: 6 },
        { recommandation: "reco 22", noteObtenue: 1, priorisation: 2 },
        { recommandation: "reco 52", noteObtenue: 1, priorisation: 5 },
        { recommandation: "reco 72", noteObtenue: 1, priorisation: 7 },
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
        ])
        .construis();

      it("en prenant en compte le niveau de priorisation de la recommandation", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .ajouteUneThematique("thematique", questions)
              .construis(),
          )
          .avecLesReponsesDonnees("contexte", [{ qc: "rqc" }])
          .avecLesReponsesDonnees("thematique", [
            { q2: "reponse-21" },
            { q1: "reponse-11" },
            { q4: "reponse-41" },
            { q3: "reponse-31" },
            { q6: "reponse-61" },
            { q5: "reponse-51" },
            { q7: "reponse-71" },
          ])
          .avecUnTableauDeNotes(tableauDeNotes)
          .avecUnTableauDeRecommandations(tableauDeRecommandations)
          .construis();

        genereLesRecommandations(diagnostic);

        expect(
          diagnostic.recommandations?.recommandationsPrioritaires,
        ).toStrictEqual([
          { recommandation: "reco 4", noteObtenue: 0, priorisation: 1 },
          { recommandation: "reco 2", noteObtenue: 0, priorisation: 2 },
          { recommandation: "reco 1", noteObtenue: 0, priorisation: 3 },
          { recommandation: "reco 3", noteObtenue: 0, priorisation: 4 },
          { recommandation: "reco 6", noteObtenue: 0, priorisation: 5 },
          { recommandation: "reco 7", noteObtenue: 0, priorisation: 6 },
        ]);
        expect(diagnostic.recommandations?.autresRecommandations).toStrictEqual(
          [{ recommandation: "reco 5", noteObtenue: 0, priorisation: 7 }],
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
                  "reponse-311": 1,
                  "reponse-312": 3,
                  "reponse-321": 1.5,
                  "reponse-322": 2,
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
          { recommandation: "reco 12", noteObtenue: 2, priorisation: 1 },
        ]);
      });
    });
  });
});
