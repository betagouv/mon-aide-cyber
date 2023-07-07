import { beforeEach, describe, expect, it } from "vitest";
import { ServiceDiagnostique } from "../../src/diagnostique/ServiceDiagnostique";
import { AdaptateurReferentielDeTest } from "../adaptateurs/AdaptateurReferentielDeTest";
import { unDiagnostique } from "../constructeurs/constructeurDiagnostique";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
  unReferentielAuContexteVide,
} from "../constructeurs/constructeurReferentiel";
import { Entrepots } from "../../src/domaine/Entrepots";
import { EntrepotsMemoire } from "../../src/infrastructure/entrepots/memoire/Entrepots";

describe("Le service de diagnostique", () => {
  let adaptateurReferentiel: AdaptateurReferentielDeTest;
  let entrepots: Entrepots;

  beforeEach(() => {
    adaptateurReferentiel = new AdaptateurReferentielDeTest();
    entrepots = new EntrepotsMemoire();
  });

  describe("Lorsque l'on veut accéder à un diagnostique", () => {
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
      adaptateurReferentiel.ajoute(diagnostique);
      const serviceDiagnostique = new ServiceDiagnostique(
        adaptateurReferentiel,
        new EntrepotsMemoire(),
      );

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

  describe("Lorsque l'on veut créer un diagnostique", () => {
    it("copie le référentiel disponible et le persiste", async () => {
      const referentiel = unReferentiel().construis();
      adaptateurReferentiel.ajoute(referentiel);

      const diagnostique = await new ServiceDiagnostique(
        adaptateurReferentiel,
        entrepots,
      ).cree();

      const diagnostiqueRetourne = await entrepots
        .diagnostique()
        .lis(diagnostique.identifiant);
      expect(diagnostiqueRetourne.identifiant).not.toBeUndefined();
      expect(diagnostiqueRetourne.referentiel).toStrictEqual(referentiel);
    });
  });
});
