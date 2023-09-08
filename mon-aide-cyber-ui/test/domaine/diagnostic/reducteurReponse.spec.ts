import { describe, expect, it } from "vitest";
import {
  EtatReponseStatut,
  initialiseReducteur,
  reducteurReponse,
  reponseChangee,
} from "../../../src/domaine/diagnostic/reducteurReponse";
import { uneReponsePossible } from "../../constructeurs/constructeurReponsePossible";
import {
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
} from "../../constructeurs/constructeurQuestions";
import { unEtatDeReponse } from "./constructeurEtaReponse";

describe("Le réducteur de réponse", () => {
  describe("dans le cas de question simple", () => {
    it("initialise le réducteur", () => {
      const reponse = uneReponsePossible().construis();
      const question = uneQuestionAChoixUnique()
        .avecDesReponses([reponse])
        .construis();

      const etatReponse = initialiseReducteur(question);

      expect(etatReponse.reponseDonnee).toStrictEqual({
        reponses: [],
        valeur: null,
      });
      expect(etatReponse.statut).toStrictEqual(EtatReponseStatut.CHARGEE);
    });

    it("initialise le réducteur avec une réponse donnée", () => {
      const reponse = uneReponsePossible().construis();
      const question = uneQuestionAChoixUnique()
        .avecDesReponses([reponse])
        .avecLaReponseDonnee(reponse)
        .construis();

      const etatReponse = initialiseReducteur(question);

      expect(etatReponse.reponseDonnee).toStrictEqual({
        reponses: [],
        valeur: reponse.identifiant,
      });
      expect(etatReponse.statut).toStrictEqual(EtatReponseStatut.CHARGEE);
    });

    it("change la réponse donnée et modifie le statut", () => {
      const nouvelleReponse = uneReponsePossible().construis();

      const etatReponse = reducteurReponse(
        unEtatDeReponse("une-question").reponseChargee().construis(),
        reponseChangee(nouvelleReponse.identifiant),
      );

      expect(etatReponse.reponseDonnee.valeur).toBe(
        nouvelleReponse.identifiant,
      );
      expect(etatReponse.statut).toBe(EtatReponseStatut.MODIFIE);
    });
  });

  describe("dans le cas de question à choix multiple", () => {
    it("prend en compte les réponses à choix multiple", () => {
      const nouvelleReponse = uneReponsePossible()
        .avecUneQuestion(
          uneQuestionTiroirAChoixMultiple().avecLibelle("QCM").construis(),
        )
        .construis();

      const etatReponse = reducteurReponse(
        unEtatDeReponse("une-question")
          .reponseChargee()
          .avecUneReponseDonnee({
            reponse: nouvelleReponse,
            reponses: [{ identifiant: "qcm", reponses: ["choix 2"] }],
          })
          .construis(),
        reponseChangee(nouvelleReponse.identifiant, {
          identifiantReponse: "qcm",
          elementReponse: "choix 3",
        }),
      );

      expect(etatReponse.reponseDonnee).toStrictEqual({
        valeur: nouvelleReponse.identifiant,
        reponses: [
          { identifiant: "qcm", reponses: new Set(["choix 2", "choix 3"]) },
        ],
      });
      expect(etatReponse.reponse()).toStrictEqual({
        identifiantQuestion: "une-question",
        reponseDonnee: {
          reponse: nouvelleReponse.identifiant,
          questions: [
            {
              identifiant: "qcm",
              reponses: ["choix 2", "choix 3"],
            },
          ],
        },
      });
      expect(etatReponse.statut).toBe(EtatReponseStatut.MODIFIE);
    });

    it("retire un élément de la réponse lorsqu'il est déja présent (l'utilisateur désélectionne cet élément)", () => {
      const nouvelleReponse = uneReponsePossible()
        .avecUneQuestion(
          uneQuestionTiroirAChoixMultiple().avecLibelle("QCM").construis(),
        )
        .construis();

      const etatReponse = reducteurReponse(
        unEtatDeReponse("une-question")
          .reponseChargee()
          .avecUneReponseDonnee({
            reponse: nouvelleReponse,
            reponses: [
              {
                identifiant: "qcm",
                reponses: ["choix 2", "choix 3", "choix 4"],
              },
            ],
          })
          .construis(),
        reponseChangee(nouvelleReponse.identifiant, {
          identifiantReponse: "qcm",
          elementReponse: "choix 4",
        }),
      );

      expect(etatReponse.reponseDonnee).toStrictEqual({
        valeur: nouvelleReponse.identifiant,
        reponses: [
          { identifiant: "qcm", reponses: new Set(["choix 2", "choix 3"]) },
        ],
      });
      expect(etatReponse.reponse()).toStrictEqual({
        identifiantQuestion: "une-question",
        reponseDonnee: {
          reponse: nouvelleReponse.identifiant,
          questions: [
            {
              identifiant: "qcm",
              reponses: ["choix 2", "choix 3"],
            },
          ],
        },
      });
      expect(etatReponse.statut).toBe(EtatReponseStatut.MODIFIE);
    });

    it("prend en compte les réponses à plusieurs questions à tiroir", () => {
      const nouvelleReponse = uneReponsePossible()
        .avecUneQuestion(
          uneQuestionTiroirAChoixMultiple().avecLibelle("tiroir 1").construis(),
        )
        .avecUneQuestion(
          uneQuestionTiroirAChoixMultiple().avecLibelle("tiroir 2").construis(),
        )
        .construis();

      const etatReponse = reducteurReponse(
        unEtatDeReponse("une-question")
          .reponseChargee()
          .avecUneReponseDonnee({
            reponse: nouvelleReponse,
            reponses: [
              {
                identifiant: "tiroir-1",
                reponses: ["choix 12", "choix 13"],
              },
              {
                identifiant: "tiroir-2",
                reponses: ["choix 21"],
              },
            ],
          })
          .construis(),
        reponseChangee(nouvelleReponse.identifiant, {
          identifiantReponse: "tiroir-2",
          elementReponse: "choix 23",
        }),
      );

      expect(etatReponse.reponseDonnee).toStrictEqual({
        valeur: nouvelleReponse.identifiant,
        reponses: [
          {
            identifiant: "tiroir-1",
            reponses: new Set(["choix 12", "choix 13"]),
          },
          {
            identifiant: "tiroir-2",
            reponses: new Set(["choix 21", "choix 23"]),
          },
        ],
      });
      expect(etatReponse.reponse()).toStrictEqual({
        identifiantQuestion: "une-question",
        reponseDonnee: {
          reponse: nouvelleReponse.identifiant,
          questions: [
            { identifiant: "tiroir-1", reponses: ["choix 12", "choix 13"] },
            { identifiant: "tiroir-2", reponses: ["choix 21", "choix 23"] },
          ],
        },
      });
      expect(etatReponse.statut).toBe(EtatReponseStatut.MODIFIE);
    });
  });
});
