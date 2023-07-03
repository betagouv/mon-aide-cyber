import { describe, expect } from "vitest";
import { unDiagnostique } from "../../consructeurs/constructeurDiagnostique";
import { unReferentiel } from "../../consructeurs/constructeurReferentiel";
import {
  diagnostiqueCharge,
  reducteurDiagnostique,
} from "../../../src/domaine/diagnostique/reducteurs";
import { uneReponsePossible } from "../../consructeurs/constructeurReponsePossible";

describe("Les réducteurs de diagnostique", () => {
  describe("Lorsque le diagnostique est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit", () => {
      const diagnostique = unDiagnostique()
        .avecUnReferentiel(
          unReferentiel()
            .avecUneQuestionEtDesReponses({ libelle: "Première question ?" }, [
              uneReponsePossible()
                .avecLibelle("Réponse D")
                .enPosition(3)
                .construis(),
              uneReponsePossible()
                .avecLibelle("Réponse B")
                .enPosition(1)
                .construis(),
              uneReponsePossible()
                .avecLibelle("Réponse A")
                .enPosition(0)
                .construis(),
              uneReponsePossible()
                .avecLibelle("Réponse C")
                .enPosition(2)
                .construis(),
            ])
            .avecUneQuestionEtDesReponses({ libelle: "Deuxième question ?" }, [
              uneReponsePossible()
                .avecLibelle("Réponse B")
                .enPosition(1)
                .construis(),
              uneReponsePossible()
                .avecLibelle("Réponse C")
                .enPosition(2)
                .construis(),
              uneReponsePossible()
                .avecLibelle("Réponse A")
                .enPosition(0)
                .construis(),
            ])
            .construis(),
        )
        .construis();

      const etatDiagnostique = reducteurDiagnostique(
        { diagnostique: undefined },
        diagnostiqueCharge(diagnostique),
      );

      const questions =
        etatDiagnostique.diagnostique.referentiel.contexte.questions;
      expect(
        questions[0].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2, 3]);
      expect(
        questions[1].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2]);
    });
  });
});
