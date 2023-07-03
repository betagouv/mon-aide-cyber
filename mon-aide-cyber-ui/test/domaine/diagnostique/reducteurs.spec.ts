import { describe, expect } from "vitest";
import { unDiagnostique } from "../../consructeurs/constructeurDiagnostique";
import { unReferentiel } from "../../consructeurs/construceurReferentiel";
import {
  diagnostiqueCharge,
  reducteurDiagnostique,
} from "../../../src/domaine/diagnostique/reducteurs";

describe("Les réducteurs de diagnostique", () => {
  describe("Lorsque le diagnostique est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit", () => {
      const diagnostique = unDiagnostique()
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
