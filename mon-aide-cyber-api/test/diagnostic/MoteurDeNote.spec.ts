import { describe, expect, it } from "vitest";
import {
  unDiagnostic,
  uneReponseDonnee,
} from "../constructeurs/constructeurDiagnostic";
import {
  MoteurDeNote,
  NotesDiagnostic,
} from "../../src/diagnostic/MoteurDeNote";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";

describe("Moteur de note", () => {
  const tableauDesRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      {
        "quelle-reponse-24": {
          niveau1: "Relisez le guide du voyageur intergalactique",
          priorisation: 2,
        },
      },
    ])
    .construis();

  const constructeurDiagnostic = unDiagnostic().avecUnTableauDeRecommandations(
    tableauDesRecommandations,
  );

  describe("pour les questions à réponse unique", () => {
    it("génère la note pour une réponse à une question", () => {
      const question = uneQuestion()
        .aChoixUnique("Quelle est la réponse?")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("42").construis(),
          uneReponsePossible()
            .avecLibelle("24")
            .associeeARecommandation("quelle-reponse-24", 1, 0)
            .construis(),
        ])
        .construis();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique("thematique", [question])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: "thematique",
            question: "quelle-est-la-reponse",
          },
          uneReponseDonnee().ayantPourReponse("24").construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: "quelle-est-la-reponse",
            note: 0,
          },
        ],
      });
    });

    it("génère les notes uniquement pour les réponses données", () => {
      const question1 = uneQuestion()
        .aChoixUnique("Quelle est la réponse?")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("42").construis(),
          uneReponsePossible()
            .avecLibelle("24")
            .associeeARecommandation("quelle-reponse-24", 1, 0)
            .construis(),
        ])
        .construis();
      const question2 = uneQuestion()
        .avecReponsesPossibles([uneReponsePossible().construis()])
        .construis();

      const diagnostic = constructeurDiagnostic
        .avecUnReferentiel(
          unReferentiel()
            .sansThematique()
            .ajouteUneThematique("thematique", [question1, question2])
            .construis(),
        )
        .ajouteUneReponseDonnee(
          {
            thematique: "thematique",
            question: "quelle-est-la-reponse",
          },
          uneReponseDonnee().ayantPourReponse("24").construis(),
        )
        .construis();

      const notes = MoteurDeNote.genereLesNotes(diagnostic);

      expect(notes).toStrictEqual<NotesDiagnostic>({
        thematique: [
          {
            identifiant: "quelle-est-la-reponse",
            note: 0,
          },
        ],
      });
    });
  });
});
