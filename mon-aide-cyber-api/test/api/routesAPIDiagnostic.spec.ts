import { afterEach, beforeEach, describe, expect, it } from "vitest";
import testeurIntegration from "./testeurIntegration";
import {
  uneQuestion,
  uneReponsePossible,
  unReferentiel,
} from "../constructeurs/constructeurReferentiel";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";
import { executeRequete } from "./executeurRequete";

describe("le serveur MAC sur les routes /api/diagnostic/", () => {
  const testeurMAC = testeurIntegration();
  let numeroPort: number;

  beforeEach(() => {
    numeroPort = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe("quand une requête GET est reçue sur /api/diagnostic/{id}", () => {
    it("retourne le référentiel du diagnostic", async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(uneQuestion().construis())
            .construis(),
        )
        .construis();
      testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        "GET",
        `/api/diagnostic/${diagnostic.identifiant}`,
        numeroPort,
      );

      expect(reponse.status).toBe(200);
      const premiereQuestion = diagnostic.referentiel.contexte.questions[0];
      const premiereReponsePossible = premiereQuestion.reponsesPossibles[0];
      expect(await reponse.json()).toStrictEqual({
        identifiant: diagnostic.identifiant,
        referentiel: {
          contexte: {
            actions: [
              {
                action: "repondre",
                chemin: "contexte",
                ressource: {
                  methode: "PATCH",
                  url: `/api/diagnostic/${diagnostic.identifiant}`,
                },
              },
            ],
            questions: [
              {
                identifiant: premiereQuestion.identifiant,
                libelle: premiereQuestion.libelle,
                reponseDonnee: {
                  valeur: null,
                  reponses: [],
                },
                reponsesPossibles: [
                  {
                    identifiant: premiereReponsePossible.identifiant,
                    libelle: premiereReponsePossible.libelle,
                    ordre: 0,
                  },
                ],
                type: "choixUnique",
              },
            ],
          },
        },
      });
    });

    it("renvoie une erreur HTTP 404 diagnostic non trouvé si le diagnostic n'existe pas", async () => {
      const reponse = await executeRequete(
        "GET",
        `/api/diagnostic/id-inexistant`,
        numeroPort,
      );

      expect(reponse.status).toBe(404);
      const newVar = await reponse.json();
      expect(newVar).toStrictEqual({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });
  });

  describe("quand une requête POST est reçue sur /api/diagnostic", () => {
    it("lance un nouveau diagnostic", async () => {
      const referentiel = unReferentiel().construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);

      const reponse = await executeRequete(
        "POST",
        "/api/diagnostic",
        numeroPort,
      );

      expect(reponse.status).toBe(201);
      expect(reponse.headers.get("Link")).toMatch(
        /api\/diagnostic\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    });

    it("on peut récupérer le diagnostic précédemment lancé", async () => {
      const referentiel = unReferentiel()
        .ajouteUneQuestionAuContexte(uneQuestion().construis())
        .construis();
      testeurMAC.adaptateurReferentiel.ajoute(referentiel);
      const reponseCreation = await executeRequete(
        "POST",
        "/api/diagnostic",
        numeroPort,
      );
      const lien = reponseCreation.headers.get("Link");

      const reponse = await executeRequete("GET", `${lien}`, numeroPort);

      const diagnosticRetourne = await reponse.json();
      expect(diagnosticRetourne.identifiant).toBe(
        lien?.substring(lien.lastIndexOf("/") + 1),
      );
      expect(diagnosticRetourne.referentiel.contexte.questions).toHaveLength(1);
    });
  });

  describe("quand une requête PATCH est reçue sur /api/diagnostic/{id}", () => {
    it("on peut donner une réponse à une question", async () => {
      const diagnostic = unDiagnostic()
        .avecUnReferentiel(
          unReferentiel()
            .ajouteUneQuestionAuContexte(
              uneQuestion()
                .aChoixUnique("Une question ?")
                .avecReponsesPossibles([
                  uneReponsePossible().avecLibelle("Réponse 1").construis(),
                  uneReponsePossible().avecLibelle("Réponse 2").construis(),
                ])
                .construis(),
            )
            .construis(),
        )
        .construis();
      testeurMAC.entrepots.diagnostic().persiste(diagnostic);

      const reponse = await executeRequete(
        "PATCH",
        `/api/diagnostic/${diagnostic.identifiant}`,
        numeroPort,
        {
          chemin: "contexte",
          identifiant: "une-question-",
          reponse: "reponse-2",
        },
      );

      expect(reponse.status).toBe(204);
      expect(
        diagnostic.referentiel.contexte.questions[0].reponseDonnee,
      ).toStrictEqual({
        reponsesMultiples: [],
        reponseUnique: "reponse-2",
      });
    });

    it("retourne une erreur HTTP 404 si le diagnostic visé n’existe pas", async () => {
      const reponse = await executeRequete(
        "PATCH",
        `/api/diagnostic/ed89a4fa-6db5-48d9-a4e2-1b424acd3b47`,
        numeroPort,
        {
          chemin: "contexte",
          identifiant: "une-question-",
          reponse: "reponse-2",
        },
      );

      expect(reponse.status).toBe(404);
      expect(await reponse.json()).toMatchObject({
        message: "Le diagnostic demandé n'existe pas.",
      });
    });
  });
});
