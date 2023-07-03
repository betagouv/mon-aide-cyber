import { describe, expect } from "vitest";
import { unReferentiel } from "../../consructeurs/construceurReferentiel";
import { unDiagnostic } from "../../consructeurs/constructeurDiagnostic";
import {
  diagnosticCharge,
  reducteurDiagnostic,
} from "../../../src/domaine/diagnostic/reducteurs";

describe("Les réducteurs de diagnostic", () => {
  describe("Lorsque le diagnostic est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .avecUneQuestion({ libelle: "Première question ?" }, [
              { libelle: "Réponse D", ordre: 3 },
              { libelle: "Réponse B", ordre: 1 },
              { libelle: "Réponse A", ordre: 0 },
              { libelle: "Réponse C", ordre: 2 },
            ])
            .avecUneQuestion({ libelle: "Deuxième question ?" }, [
              { libelle: "Réponse B", ordre: 1 },
              { libelle: "Réponse C", ordre: 2 },
              { libelle: "Réponse A", ordre: 0 },
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
