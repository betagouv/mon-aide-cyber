import { describe, expect, it } from "vitest";
import { unReferentiel } from "../../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../../constructeurs/constructeurDiagnostic";
import {
  diagnosticCharge,
  reducteurDiagnostic,
  thematiqueAffichee,
} from "../../../src/domaine/diagnostic/reducteurDiagnostic";
import { uneReponsePossible } from "../../constructeurs/constructeurReponsePossible";
import {
  uneQuestionAChoixMultiple,
  uneQuestionAChoixUnique,
  uneQuestionTiroirAChoixUnique,
} from "../../constructeurs/constructeurQuestions";

describe("Les réducteurs de diagnostic", () => {
  describe("Lorsque le diagnostic est chargé", () => {
    it("trie les réponses aux questions par l'ordre définit pour la thématique 'Contexte'", () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .avecUneQuestionEtDesReponses(
              { libelle: "Première question ?", type: "choixUnique" },
              [
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
              ],
            )
            .avecUneQuestionEtDesReponses(
              { libelle: "Deuxième question ?", type: "choixUnique" },
              [
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
              ],
            )
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
              uneQuestionAChoixUnique()
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
              uneQuestionAChoixUnique()
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
                      uneQuestionTiroirAChoixUnique()
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
                    .avecUneQuestion(
                      uneQuestionTiroirAChoixUnique()
                        .avecDesReponses([
                          uneReponsePossible()
                            .avecLibelle("Réponse Z")
                            .enPosition(1)
                            .construis(),
                          uneReponsePossible()
                            .avecLibelle("Réponse Y")
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
        thematiqueContexte.questions[0].reponsesPossibles[0].questions[0].reponsesPossibles.map(
          (reponse) => reponse.ordre,
        ),
      ).toStrictEqual([0, 1]);
      expect(
        thematiqueContexte.questions[0].reponsesPossibles[0].questions[1].reponsesPossibles.map(
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
