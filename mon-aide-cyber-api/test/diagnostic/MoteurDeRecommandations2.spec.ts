import { describe, expect, it } from "vitest";
import {
  uneQuestionDiagnostic,
  uneReponseDonnee,
} from "../constructeurs/constructeurDiagnostic";
import {
  uneQuestionATiroir,
  uneReponsePossible,
} from "../constructeurs/constructeurReferentiel";
import { unTableauDeRecommandations } from "../constructeurs/constructeurTableauDeRecommandations";
import { MoteurDeRecommandations2 } from "../../src/diagnostic/MoteurDeRecommandations2";
import { Recommandation } from "../../src/diagnostic/Diagnostic";

describe("Moteur de recommandations", () => {
  const tableauDeRecommandations = unTableauDeRecommandations()
    .avecLesRecommandations([
      {
        RGPD: {
          niveau1: "reco 1",
          niveau2: "reco 2",
          priorisation: 1,
        },
        RGPD2: {
          niveau1: "reco RGPD 2 1",
          niveau2: "reco RGPD 2 2",
          priorisation: 2,
        },
      },
    ])
    .construis();

  describe("recommande les recommandations aux réponses fournies", () => {
    it("de niveau 1", () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle("Non")
            .associeeARecommandation("RGPD", 1, 0)
            .construis(),
        ])
        .ayantLaReponseUnique("non")
        .construis();

      const recommandations = MoteurDeRecommandations2.get(true)?.genere(
        questionRepondue,
        tableauDeRecommandations,
      );

      expect(recommandations).toStrictEqual<Recommandation[]>([
        {
          niveau: {
            titre: "reco 1",
            comment: "comme ça",
            pourquoi: "parce-que",
          },
          noteObtenue: 0,
          priorisation: 1,
        },
      ]);
    });

    it("de niveau 2", () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle("Oui mais")
            .associeeARecommandation("RGPD", 2, 1)
            .construis(),
        ])
        .ayantLaReponseUnique("oui-mais")
        .construis();

      const recommandations = MoteurDeRecommandations2.get(true)?.genere(
        questionRepondue,
        tableauDeRecommandations,
      );

      expect(recommandations).toStrictEqual<Recommandation[]>([
        {
          niveau: {
            titre: "reco 2",
            comment: "comme ça",
            pourquoi: "parce-que",
          },
          noteObtenue: 1,
          priorisation: 1,
        },
      ]);
    });

    it("avec plusieurs recommandations", () => {
      const questionRepondue = uneQuestionDiagnostic()
        .avecLesReponsesPossibles([
          uneReponsePossible()
            .avecLibelle("Oui mais")
            .associeeARecommandation("RGPD", 2, 2)
            .associeeARecommandation("RGPD2", 1, 0)
            .construis(),
        ])
        .ayantLaReponseUnique("oui-mais")
        .construis();

      const recommandations = MoteurDeRecommandations2.get(true)?.genere(
        questionRepondue,
        tableauDeRecommandations,
      );

      expect(recommandations).toStrictEqual<Recommandation[]>([
        {
          niveau: {
            titre: "reco 2",
            comment: "comme ça",
            pourquoi: "parce-que",
          },
          noteObtenue: 2,
          priorisation: 1,
        },
        {
          niveau: {
            titre: "reco RGPD 2 1",
            comment: "comme ça",
            pourquoi: "parce-que",
          },
          noteObtenue: 0,
          priorisation: 2,
        },
      ]);
    });

    describe("pour les questions à tiroir", () => {
      const tableauDeRecommandations = unTableauDeRecommandations()
        .avecLesRecommandations([
          {
            "obsolete-annee-1980": {
              niveau1: "Les années 80 c’est bien mais",
              niveau2: "Passez aux années 90",
              priorisation: 3,
            },
          },
        ])
        .construis();
      it("unique", () => {
        const questionRepondue = uneQuestionDiagnostic()
          .avecLibelle("Avez-vous un ordinateur?")
          .avecLesReponsesPossibles([
            uneReponsePossible()
              .avecLibelle("Ordinateur obsolète")
              .ajouteUneQuestionATiroir(
                uneQuestionATiroir()
                  .aChoixUnique("Quelle année?")
                  .avecReponsesPossibles([
                    uneReponsePossible()
                      .avecLibelle("1980")
                      .associeeARecommandation("obsolete-annee-1980", 1, 0)
                      .construis(),
                  ])
                  .construis(),
              )
              .construis(),
          ])
          .ayantLaReponseDonnee(
            uneReponseDonnee()
              .ayantPourReponse("ordinateur-obsolete")
              .avecDesReponsesMultiples([
                {
                  identifiant: "quelle-annee",
                  reponses: ["1980"],
                },
              ])
              .construis(),
          )
          .construis();

        const recommandations = MoteurDeRecommandations2.get(false)?.genere(
          questionRepondue,
          tableauDeRecommandations,
        );

        expect(recommandations).toStrictEqual<Recommandation[]>([
          {
            niveau: {
              titre: "Les années 80 c’est bien mais",
              comment: "comme ça",
              pourquoi: "parce-que",
            },
            noteObtenue: 0,
            priorisation: 3,
          },
        ]);
      });
    });
  });
});
