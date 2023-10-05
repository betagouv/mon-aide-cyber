import { describe, expect, it } from "vitest";
import { MoteurDeRecommandations } from "../../src/diagnostic/MoteurDeRecommandations";
import {
  unDiagnostic,
  uneReponseDonnee,
} from "../constructeurs/constructeurDiagnostic";
import {
  uneQuestion,
  uneQuestionATiroir,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import { unTableauDeNotes } from "../constructeurs/constructeurTableauDeNotes";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";

describe("Moteur de recommandations", () => {
  const tableauDeNotes = unTableauDeNotes()
    .avecDesNotes([
      {
        "la-question": {
          "rep-1": {
            operation: "moyenne",
            reponses: {
              "rep-111": 1,
              "rep-112": 1,
              "rep-121": 1,
              "rep-122": 1,
            },
          },
          "rep-2": {
            operation: "moyenne",
            reponses: {
              "rep-211": 0.5,
              "rep-212": 1,
              "rep-221": 0.5,
            },
          },
        },
      },
    ])
    .construis();

  const tableauDeRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      {
        "la-question": {
          niveau1: "reco 1",
          niveau2: "reco 2",
          priorisation: 1,
        },
      },
    ])
    .construis();

  const reponseATiroir = uneReponsePossible()
    .avecLibelle("rep 1")
    .ajouteUneQuestionATiroir(
      uneQuestionATiroir()
        .aChoixUnique("la sous question 1")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("rep 111").construis(),
          uneReponsePossible().avecLibelle("rep 112").construis(),
        ])
        .construis(),
    )
    .ajouteUneQuestionATiroir(
      uneQuestionATiroir()
        .aChoixUnique("la sous question 2")
        .avecReponsesPossibles([
          uneReponsePossible().avecLibelle("rep 121").construis(),
          uneReponsePossible().avecLibelle("rep 122").construis(),
        ])
        .construis(),
    )
    .construis();
  const question = uneQuestion()
    .aChoixUnique("La question")
    .avecReponsesPossibles([
      reponseATiroir,
      uneReponsePossible()
        .avecLibelle("rep 2")
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle("rep-211").construis(),
              uneReponsePossible().avecLibelle("rep-212").construis(),
            ])
            .construis(),
        )
        .ajouteUneQuestionATiroir(
          uneQuestionATiroir()
            .avecReponsesPossibles([
              uneReponsePossible().avecLibelle("rep-221").construis(),
            ])
            .construis(),
        )
        .construis(),
    ])
    .construis();

  it("recommande une seule fois pour une question avec plusieurs réponses à question à tiroir", () => {
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentiel()
          .sansThematique()
          .ajouteUneThematique("multi-tiroir", [question])
          .construis(),
      )
      .avecUnTableauDeNotes(tableauDeNotes)
      .avecUnTableauDeRecommandations(tableauDeRecommandations)
      .ajouteUneReponseDonnee(
        { thematique: "multi-tiroir", question: "la-question" },
        uneReponseDonnee()
          .ayantPourReponse("rep-1")
          .avecDesReponsesMultiples([
            {
              identifiant: "la-sous-question-1",
              reponses: ["rep-111"],
            },
            {
              identifiant: "la-sous-question-2",
              reponses: ["rep-122"],
            },
          ])
          .construis(),
      )
      .construis();

    const recommandations = MoteurDeRecommandations.get(false)?.genere(
      diagnostic,
      diagnostic.referentiel["multi-tiroir"].questions[0],
    );

    expect(recommandations).toHaveLength(1);
    expect(recommandations).toStrictEqual([
      {
        comment: "comme ça",
        noteObtenue: 1,
        pourquoi: "parce-que",
        priorisation: 1,
        titre: "reco 2",
      },
    ]);
  });
});
