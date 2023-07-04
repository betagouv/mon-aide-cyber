import { describe, expect } from "vitest";
import { unDiagnostic } from "../../consructeurs/constructeurDiagnostic";
import {
  diagnosticCharge,
  reducteurDiagnostic,
} from "../../../src/domaine/diagnostic/reducteurs";
import { uneReponsePossible } from "../../consructeurs/constructeurReponsePossible";
import { unReferentiel } from "../../consructeurs/constructeurReferentiel";

describe("Les réducteurs de diagnostic", () => {
  describe("Lorsque le diagnostic est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit", () => {
      const diagnostic = unDiagnostic()
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

      const etatDiagnostic = reducteurDiagnostic(
        { diagnostic: undefined },
        diagnosticCharge(diagnostic),
      );

      const questions =
        etatDiagnostic.diagnostic.referentiel.contexte.questions;
      expect(
        questions[0].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2, 3]);
      expect(
        questions[1].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2]);
    });
  });
});
