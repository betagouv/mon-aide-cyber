import { describe, expect } from "vitest";
import { representeLeDiagnostiquePourLeClient } from "../../../src/api/representateurs/representateurDiagnostique";
import {
  uneQuestion,
  unReferentielAuContexteVide,
} from "../../constructeurs/constructeurReferentiel";
import { unDiagnostique } from "../../constructeurs/constructeurDiagnostique";

describe("Le représentateur de diagnostique", () => {
  it("définit le type de saisie que doit faire l'utilisateur", () => {
    const diagnostique = unDiagnostique()
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

    const diagnostiqueRepresente = representeLeDiagnostiquePourLeClient(
      diagnostique,
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
      diagnostiqueRepresente.referentiel.contexte.questions[0]
        .reponsesPossibles;
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
