import { describe, expect, it } from "vitest";
import {
  EtatReponseStatut,
  initialiseReducteur,
  reducteurReponse,
  reponseChangee,
} from "../../../src/domaine/diagnostic/reducteurReponse";
import { uneReponsePossible } from "../../constructeurs/constructeurReponsePossible";
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixMultiple,
} from "../../constructeurs/constructeurQuestions";

describe("Le réducteur de réponse", () => {
  describe("dans le cas de question simple", () => {
    it("initialise le réducteur", () => {
      const reponse = uneReponsePossible().construis();
      const question = uneQuestionAChoixUnique()
        .avecDesReponses([reponse])
        .construis();

      const etatReponse = initialiseReducteur(question);

      expect(etatReponse.reponseDonnee).toStrictEqual({
        reponsesMultiples: new Set(),
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
        valeur: reponse.identifiant,
        reponsesMultiples: new Set(),
      });
      expect(etatReponse.statut).toStrictEqual(EtatReponseStatut.CHARGEE);
    });

    it("change la réponse donnée et modifie le statut", () => {
      const nouvelleReponse = uneReponsePossible().construis();

      const etatReponse = reducteurReponse(
        {
          identifiantQuestion: "une-question",
          reponse: () => null,
          reponseDonnee: { valeur: null, reponsesMultiples: new Set() },
          statut: EtatReponseStatut.CHARGEE,
          valeur: () => nouvelleReponse.libelle,
        },
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
        {
          identifiantQuestion: "une-question",
          reponse: () => null,
          reponseDonnee: {
            valeur: nouvelleReponse.identifiant,
            reponsesMultiples: new Set(["choix 2"]),
          },
          statut: EtatReponseStatut.CHARGEE,
          valeur: () => nouvelleReponse.libelle,
        },
        reponseChangee(nouvelleReponse.identifiant, {
          identifiantReponse: "qcm",
          elementReponse: "choix 3",
        }),
      );

      expect(etatReponse.reponseDonnee).toStrictEqual({
        valeur: nouvelleReponse.identifiant,
        reponsesMultiples: new Set(["choix 2", "choix 3"]),
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
        {
          identifiantQuestion: "une-question",
          reponse: () => null,
          reponseDonnee: {
            valeur: nouvelleReponse.identifiant,
            reponsesMultiples: new Set(["choix 2", "choix 3", "choix 4"]),
          },
          valeur: () => nouvelleReponse.libelle,
          statut: EtatReponseStatut.CHARGEE,
        },
        reponseChangee(nouvelleReponse.identifiant, {
          identifiantReponse: "qcm",
          elementReponse: "choix 4",
        }),
      );

      expect(etatReponse.reponseDonnee).toStrictEqual({
        valeur: nouvelleReponse.identifiant,
        reponsesMultiples: new Set(["choix 2", "choix 3"]),
      });
      expect(etatReponse.statut).toBe(EtatReponseStatut.MODIFIE);
    });
  });
});
