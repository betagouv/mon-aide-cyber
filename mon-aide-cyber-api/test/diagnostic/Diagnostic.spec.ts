import { describe, expect } from "vitest";
import { unTableauDeNotes } from "../constructeurs/constructeurTableauDeNotes";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";
import {
  uneListeDeQuestions,
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import {
  ajouteLaReponseAuDiagnostic,
  genereLesRecommandations,
} from "../../src/diagnostic/Diagnostic";

describe("Diagnostic", () => {
  describe("Lorsque l'on répond à une question", () => {
    describe("À choix multiples", () => {
      it("prend en compte les réponses données", () => {
        const diagnostic = unDiagnostic()
          .avecUnReferentiel(
            unReferentiel()
              .sansThematique()
              .ajouteUneThematique("multiple", [
                uneQuestion()
                  .aChoixMultiple("Ma question ?")
                  .avecReponsesPossibles([
                    uneReponsePossible().avecLibelle("rep 1").construis(),
                    uneReponsePossible().avecLibelle("rep 2").construis(),
                    uneReponsePossible().avecLibelle("rep 3").construis(),
                  ])
                  .construis(),
              ])
              .construis(),
          )
          .construis();

        ajouteLaReponseAuDiagnostic(diagnostic, {
          chemin: "multiple",
          identifiant: "ma-question-",
          reponse: ["rep-2", "rep-3"],
        });

        expect(
          diagnostic.referentiel["multiple"].questions[0].reponseDonnee,
        ).toStrictEqual({
          reponsesMultiples: [
            {
              identifiant: "ma-question-",
              reponses: new Set(["rep-2", "rep-3"]),
            },
          ],
          reponseUnique: null,
        });
      });
    });
  });
  describe("lorsque l'on génère les recommandations", () => {
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
        { q1: { niveau1: "reco 1", niveau2: "reco 12" } },
        { q2: { niveau1: "reco 2", niveau2: "reco 22" } },
        { q3: { niveau1: "reco 3", niveau2: "reco 32" } },
        { q4: { niveau1: "reco 4", niveau2: "reco 42" } },
        { q5: { niveau1: "reco 5", niveau2: "reco 52" } },
        { q6: { niveau1: "reco 6", niveau2: "reco 62" } },
        { q7: { niveau1: "reco 7", niveau2: "reco 72" } },
      ])
      .construis();
    const questions = uneListeDeQuestions()
      .dontLesLabelsSont(["q1", "q2", "q3", "q4", "q5", "q6", "q7"])
      .avecLesReponsesPossiblesSuivantes([
        ["reponse 11", "reponse 12", "reponse 13"],
        ["reponse 21", "reponse 22", "reponse 23"],
        ["reponse 31", "reponse 32", "reponse 33"],
        ["reponse 41", "reponse 42", "reponse 43"],
        ["reponse 51", "reponse 52", "reponse 53"],
        ["reponse 61", "reponse 62", "reponse 63"],
        ["reponse 71", "reponse 72", "reponse 73"],
      ])
      .construis();

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

      expect(diagnostic.recommandations).toStrictEqual([
        { recommandation: "reco 1", noteObtenue: 0 },
        { recommandation: "reco 3", noteObtenue: 0 },
        { recommandation: "reco 4", noteObtenue: 0 },
        { recommandation: "reco 6", noteObtenue: 0 },
        { recommandation: "reco 22", noteObtenue: 1 },
        { recommandation: "reco 52", noteObtenue: 1 },
        { recommandation: "reco 72", noteObtenue: 1 },
      ]);
    });

    it("les réponses entraînant une note 'null' sont écartées des recommandations", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique("thematique", questions)
            .construis(),
        )
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

      expect(diagnostic.recommandations).toStrictEqual([
        { recommandation: "reco 3", noteObtenue: 0 },
        { recommandation: "reco 6", noteObtenue: 0 },
        { recommandation: "reco 22", noteObtenue: 1 },
        { recommandation: "reco 52", noteObtenue: 1 },
        { recommandation: "reco 72", noteObtenue: 1 },
      ]);
    });

    it("prend en compte les questions ne donnant pas lieu à une recommandation", () => {
      const questionContexte = uneQuestion()
        .aChoixUnique("qc")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("ꞧqc").construis(),
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

      expect(diagnostic.recommandations).toStrictEqual([
        { recommandation: "reco 3", noteObtenue: 0 },
        { recommandation: "reco 6", noteObtenue: 0 },
        { recommandation: "reco 22", noteObtenue: 1 },
        { recommandation: "reco 52", noteObtenue: 1 },
        { recommandation: "reco 72", noteObtenue: 1 },
      ]);
    });
  });
});
