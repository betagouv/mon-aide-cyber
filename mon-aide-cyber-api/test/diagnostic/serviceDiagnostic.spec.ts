import { beforeEach, describe, expect, it } from "vitest";
import { AdaptateurDonneesDeTest } from "../adaptateurs/AdaptateurDonneesDeTest";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentielAuContexteVide,
} from "../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";
import { ServiceDiagnostic } from "../../src/diagnostic/ServiceDiagnostic";

describe("Le service de diagnostic", () => {
  let adaptateurDonnees: AdaptateurDonneesDeTest;

  beforeEach(() => {
    adaptateurDonnees = new AdaptateurDonneesDeTest();
  });

  it("retourne un diagnostic contenant une réponse avec une question à tiroir", async () => {
    const reponseAttendue = uneReponsePossible()
      .avecQuestionATiroir(
        uneQuestion()
          .aChoixMultiple("Quelles réponses ?", [
            { identifiant: "reponse-a", libelle: "Réponse A" },
            { identifiant: "reponse-b", libelle: "Réponse B" },
            { identifiant: "reponse-c", libelle: "Réponse C" },
          ])
          .construis()
      )
      .construis();
    const question = uneQuestion()
      .avecReponsesPossibles([
        uneReponsePossible().construis(),
        reponseAttendue,
      ])
      .construis();
    const diagnostic = unDiagnostic()
      .avecUnReferentiel(
        unReferentielAuContexteVide()
          .ajouteUneQuestionAuContexte(uneQuestion().construis())
          .ajouteUneQuestionAuContexte(question)
          .construis()
      )
      .construis();
    adaptateurDonnees.ajoute(diagnostic);
    const serviceDiagnostic = new ServiceDiagnostic(adaptateurDonnees);

    const diagnosticRetourne = await serviceDiagnostic.diagnostic(
      diagnostic.identifiant
    );

    expect(
      diagnosticRetourne.referentiel.contexte.questions[1].reponsesPossibles[1]
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
