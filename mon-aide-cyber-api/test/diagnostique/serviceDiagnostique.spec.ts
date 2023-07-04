import { beforeEach, describe, expect, it } from "vitest";
import { ServiceDiagnostique } from "../../src/diagnostique/serviceDiagnostique";
import { AdaptateurDonneesDeTest } from "../adaptateurs/AdaptateurDonneesDeTest";
import { unDiagnostique } from "../constructeurs/constructeurDiagnostique";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentielAuContexteVide,
} from "../constructeurs/constructeurReferentiel";

describe("Le service de diagnostique", () => {
  let adaptateurDonnees: AdaptateurDonneesDeTest;

  beforeEach(() => {
    adaptateurDonnees = new AdaptateurDonneesDeTest();
  });

  it("retourne un diagnostique contenant une réponse avec une question à tiroir", async () => {
    const reponseAttendue = uneReponsePossible()
      .avecQuestionATiroir(
        uneQuestion()
          .aChoixMultiple("Quelles réponses ?", [
            { identifiant: "reponse-a", libelle: "Réponse A" },
            { identifiant: "reponse-b", libelle: "Réponse B" },
            { identifiant: "reponse-c", libelle: "Réponse C" },
          ])
          .construis(),
      )
      .construis();
    const question = uneQuestion()
      .avecReponsesPossibles([
        uneReponsePossible().construis(),
        reponseAttendue,
      ])
      .construis();
    const diagnostique = unDiagnostique()
      .avecUnReferentiel(
        unReferentielAuContexteVide()
          .ajouteUneQuestionAuContexte(uneQuestion().construis())
          .ajouteUneQuestionAuContexte(question)
          .construis(),
      )
      .construis();
    adaptateurDonnees.ajoute(diagnostique);
    const serviceDiagnostique = new ServiceDiagnostique(adaptateurDonnees);

    const diagnostiqueRetourne = await serviceDiagnostique.diagnostique(
      diagnostique.identifiant,
    );

    expect(
      diagnostiqueRetourne.referentiel.contexte.questions[1]
        .reponsesPossibles[1],
    ).toStrictEqual({
      identifiant: reponseAttendue.identifiant,
      libelle: reponseAttendue.libelle,
      ordre: reponseAttendue.ordre,
      questionATiroir: {
        identifiant: "quelles-reponses-",
        libelle: "Quelles réponses ?",
        reponsesPossibles: [
          { identifiant: "reponse-a", libelle: "Réponse A", ordre: 0 },
          { identifiant: "reponse-b", libelle: "Réponse B", ordre: 1 },
          { identifiant: "reponse-c", libelle: "Réponse C", ordre: 2 },
        ],
        type: "choixMultiple",
      },
    });
  });
});
