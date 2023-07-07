import { afterAll, beforeAll, describe, expect, it } from "vitest";
import testeurIntegration from "./testeurIntegration";
import { unReferentiel } from "../constructeurs/constructeurReferentiel";
import { unDiagnostique } from "../constructeurs/constructeurDiagnostique";

describe("le serveur MAC sur les routes /api/diagnostique/", () => {
  const testeurMAC = testeurIntegration();

  beforeAll(() => testeurMAC.initialise());

  afterAll(() => testeurMAC.arrete());

  describe("quand une requête GET est reçue sur /api/diagnostique/{id}", () => {
    it("retourne le référentiel du diagnostique", async () => {
      const diagnostique = unDiagnostique()
        .avecUnReferentiel(unReferentiel().construis())
        .construis();
      testeurMAC.entrepots.diagnostique().persiste(diagnostique);

      const reponse = await fetch(
        `http://localhost:1234/api/diagnostique/${diagnostique.identifiant}`,
      );

      expect(reponse.status).toBe(200);
      const premiereQuestion = diagnostique.referentiel.contexte.questions[0];
      const premiereReponsePossible = premiereQuestion.reponsesPossibles[0];
      expect(await reponse.json()).toMatchObject({
        identifiant: diagnostique.identifiant,
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

    it("renvoie une erreur 404 diagnostique non trouvé si le diagnostique n'existe pas", async () => {
      const reponse = await fetch(
        `http://localhost:1234/api/diagnostique/id-inexistant`,
      );

      expect(reponse.status).toBe(404);
      const newVar = await reponse.json();
      expect(newVar).toStrictEqual({
        message: "Le diagnostique demandé n'existe pas.",
      });
    });
  });

  describe("quand une requête POST est reçue sur /api/diagnostique", () => {
    it("crée un nouveau diagnostique", async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await fetch("http://localhost:1234/api/diagnostique", {
        method: "POST",
      });

      expect(reponse.status).toBe(201);
      expect(reponse.headers.get("Link")).toMatch(
        /api\/diagnostique\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it("on peut récupérer le diagnostique précédemment créé", async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);
      const reponseCreation = await fetch(
        "http://localhost:1234/api/diagnostique",
        {
          method: "POST",
        },
      );
      const lien = reponseCreation.headers.get("Link");

      const reponse = await fetch(`http://localhost:1234${lien}`);

      const diagnostiqueRetourne = await reponse.json();
      expect(diagnostiqueRetourne.identifiant).toBe(
        lien?.substring(lien.lastIndexOf("/") + 1),
      );
      expect(diagnostiqueRetourne.referentiel.contexte.questions).toHaveLength(
        1,
      );
    });
  });
});
