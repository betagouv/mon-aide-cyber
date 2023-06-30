import { describe, expect } from "vitest";
import {
  uneQuestion,
  unReferentielAuContexteVide,
} from "../../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../../constructeurs/constructeurDiagnostic";
import { representeLeDiagnosticPourLeClient } from "../../../src/api/representateurs/representateurDiagnostic";

describe("Le représentateur de diagnostic", () => {
  it("définit le type de saisie que doit faire l'utilisateur", () => {
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentielAuContexteVide()
          .ajouteUneQuestionAuContexte(
            uneQuestion()
              .aChoixUnique("Quelle est la question?", [
                { identifiant: "reponse1", libelle: "réponse 1" },
                { identifiant: "reponse2", libelle: "réponse 2" },
                { identifiant: "reponse3", libelle: "réponse 3" },
              ])
              .construis(),
          )
          .construis(),
      )
      .construis();

    const diagnosticRepresente = representeLeDiagnosticPourLeClient(
      diagnostic,
      {
        contexte: {
          questions: [
            {
              identifiant: "quelle-est-la-question",
              reponses: [
                {
                  identifiant: "reponse1",
                  type: { type: "saisieLibre", format: "texte" },
                },
                {
                  identifiant: "reponse2",
                  type: { type: "saisieLibre", format: "nombre" },
                },
              ],
            },
          ],
        },
      },
    );

    const reponsesPossibles =
      diagnosticRepresente.referentiel.contexte.questions[0].reponsesPossibles;
    expect(reponsesPossibles[0].type).toStrictEqual({
      type: "saisieLibre",
      format: "texte",
    });
    expect(reponsesPossibles[1].type).toStrictEqual({
      type: "saisieLibre",
      format: "nombre",
    });
    expect(reponsesPossibles[2].type).toBeUndefined();
  });
});
