import { afterAll, beforeAll, describe, expect, it } from "vitest";
import testeurIntegration from "./testeurIntegration";
import * as crypto from "crypto";
import { unReferentiel } from "../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";

describe("le serveur MAC sur les routes /api/diagnostic/", () => {
  const testeurMAC = testeurIntegration();

  beforeAll(() => testeurMAC.initialise());

  afterAll(() => testeurMAC.arrete());

  describe("quand une requête GET est reçue sur /api/diagnostic/{id}", () => {
    it("retourne le référentiel du diagnostic", async () => {
      const id = crypto.randomUUID();
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(unReferentiel().construis())
        .construis();
      testeurMAC.adaptateurDonnees.ajoute(diagnostic.referentiel);

      const reponse = await fetch(`http://localhost:1234/api/diagnostic/${id}`);

      expect(reponse.status).toBe(200);
      const premiereQuestion = diagnostic.referentiel.contexte.questions[0];
      const premiereReponsePossible = premiereQuestion.reponsesPossibles[0];
      expect(await reponse.json()).toMatchObject({
        identifiant: id,
        referentiel: {
          contexte: {
            questions: [
              {
                identifiant: premiereQuestion.identifiant,
                libelle: premiereQuestion.libelle,
                reponsesPossibles: [
                  {
                    identifiant: premiereReponsePossible.identifiant,
                    libelle: premiereReponsePossible.libelle,
                    ordre: 0,
                  },
                ],
              },
            ],
          },
        },
      });
    });
  });
});
