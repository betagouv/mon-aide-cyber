import { afterEach, beforeEach, describe, expect, it } from "vitest";
import testeurIntegration from "./testeurIntegration";
import { executeRequete } from "./executeurRequete";
import { unDiagnostic } from "../constructeurs/constructeurDiagnostic";

describe("le serveur MAC sur les routes /api/diagnostics/", () => {
  const testeurMAC = testeurIntegration();
  let numeroPort: number;

  beforeEach(() => {
    numeroPort = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe("quand une requête GET est reçue sur /api/diagnostics", () => {
    it("retourne la liste de diagnostics ", async () => {
      const premierDiagnostic = unDiagnostic().construis();
      const deuxiemeDiagnostic = unDiagnostic().construis();
      const troisiemeDiagnostic = unDiagnostic().construis();
      testeurMAC.entrepots.diagnostic().persiste(premierDiagnostic);
      testeurMAC.entrepots.diagnostic().persiste(deuxiemeDiagnostic);
      testeurMAC.entrepots.diagnostic().persiste(troisiemeDiagnostic);

      const reponse = await executeRequete(
        "GET",
        "/api/diagnostics",
        numeroPort,
      );

      expect(reponse.status).toBe(200);
      expect(await reponse.json()).toStrictEqual([
        {
          identifiant: premierDiagnostic.identifiant,
          actions: [
            { details: `/api/diagnostic/${premierDiagnostic.identifiant}` },
          ],
        },
        {
          identifiant: deuxiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostic/${deuxiemeDiagnostic.identifiant}`,
            },
          ],
        },
        {
          identifiant: troisiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostic/${troisiemeDiagnostic.identifiant}`,
            },
          ],
        },
      ]);
    });
  });
});
