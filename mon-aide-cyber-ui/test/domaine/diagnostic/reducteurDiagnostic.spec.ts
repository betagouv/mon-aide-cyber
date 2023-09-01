import { describe, expect, it } from "vitest";
import { unDiagnostic } from "../../consructeurs/constructeurDiagnostic";
import {
  diagnosticCharge,
  reducteurDiagnostic,
  thematiqueAffichee,
} from "../../../src/domaine/diagnostic/reducteurDiagnostic";
import { uneReponsePossible } from "../../consructeurs/constructeurReponsePossible";
import { unReferentiel } from "../../consructeurs/constructeurReferentiel";
import {
  uneQuestion,
  uneQuestionAChoixMultiple,
} from "../../consructeurs/constructeurQuestions";

describe("Les réducteurs de diagnostic", () => {
  describe("Lorsque le diagnostic est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit pour la thématique 'Contexte'", () => {
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
        { diagnostic: undefined, thematiqueAffichee: undefined },
        diagnosticCharge(diagnostic),
      );

      const questions =
        etatDiagnostic.diagnostic.referentiel["contexte"].questions;
      expect(
        questions[0].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2, 3]);
      expect(
        questions[1].reponsesPossibles.map((reponse) => reponse.ordre),
      ).toStrictEqual([0, 1, 2]);
    });

    it("trie les réponses aux questions pour toutes les thématiques", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .avecUneQuestion(
              uneQuestion()
                .avecDesReponses([
                  uneReponsePossible()
                    .avecLibelle("Réponse B")
                    .enPosition(1)
                    .construis(),
                  uneReponsePossible()
                    .avecLibelle("Réponse A")
                    .enPosition(0)
                    .construis(),
                ])
                .construis(),
            )
            .ajouteUneThematique("Autre thématique", [
              uneQuestion()
                .avecDesReponses([
                  uneReponsePossible()
                    .avecLibelle("Réponse B")
                    .enPosition(1)
                    .construis(),
                  uneReponsePossible()
                    .avecLibelle("Réponse A")
                    .enPosition(0)
                    .construis(),
                ])
                .construis(),
            ])
            .construis(),
        )
        .construis();

      const etatDiagnostic = reducteurDiagnostic(
        { diagnostic: undefined, thematiqueAffichee: undefined },
        diagnosticCharge(diagnostic),
      );

      const thematiqueContexte =
        etatDiagnostic.diagnostic.referentiel["contexte"];
      const thematiqueAutreThematique =
        etatDiagnostic.diagnostic.referentiel["Autre thématique"];
      expect(
        thematiqueContexte.questions[0].reponsesPossibles.map(
          (reponse) => reponse.ordre,
        ),
      ).toStrictEqual([0, 1]);
      expect(
        thematiqueAutreThematique.questions[0].reponsesPossibles.map(
          (reponse) => reponse.ordre,
        ),
      ).toStrictEqual([0, 1]);
    });

    it("trie les réponses des questions à tiroir", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .avecUneQuestion(
              uneQuestionAChoixMultiple()
                .avecDesReponses([
                  uneReponsePossible()
                    .avecUneQuestion(
                      uneQuestion()
                        .avecDesReponses([
                          uneReponsePossible()
                            .avecLibelle("Réponse B")
                            .enPosition(1)
                            .construis(),
                          uneReponsePossible()
                            .avecLibelle("Réponse A")
                            .enPosition(0)
                            .construis(),
                        ])
                        .construis(),
                    )
                    .construis(),
                ])
                .construis(),
            )
            .construis(),
        )
        .construis();

      const etatDiagnostic = reducteurDiagnostic(
        { diagnostic: undefined, thematiqueAffichee: undefined },
        diagnosticCharge(diagnostic),
      );

      const thematiqueContexte =
        etatDiagnostic.diagnostic.referentiel["contexte"];
      expect(
        thematiqueContexte.questions[0].reponsesPossibles[0].question.reponsesPossibles.map(
          (reponse) => reponse.ordre,
        ),
      ).toStrictEqual([0, 1]);
    });
  });

  describe("Lorsque l'on veut changer la thématique affichée", () => {
    it("change la thématique affichée", () => {
      const etatDiagnostic = reducteurDiagnostic(
        {
          diagnostic: undefined,
          thematiqueAffichee: undefined,
        },
        thematiqueAffichee("nouvelle-thematique"),
      );
      expect(etatDiagnostic.thematiqueAffichee).toBe("nouvelle-thematique");
    });
  });
});
