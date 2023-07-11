import { afterEach, beforeEach, describe, expect, it } from "vitest";
import testeurIntegration from "./testeurIntegration";
import { unDiagnostique } from "../constructeurs/constructeurDiagnostique";
import { executeRequete } from "./executeurRequete";

describe("le serveur MAC sur les routes /api/diagnostics/", () => {
  const testeurMAC = testeurIntegration();
  let numeroPort: number;

  beforeEach(() => {
    numeroPort = testeurMAC.initialise();
  });

  afterEach(() => testeurMAC.arrete());

  describe("quand une requête GET est reçue sur /api/diagnostics", () => {
    it("retourne la liste de diagnostics ", async () => {
      const premierDiagnostic = unDiagnostique().construis();
      const deuxiemeDiagnostic = unDiagnostique().construis();
      const troisiemeDiagnostic = unDiagnostique().construis();
      testeurMAC.entrepots.diagnostique().persiste(premierDiagnostic);
      testeurMAC.entrepots.diagnostique().persiste(deuxiemeDiagnostic);
      testeurMAC.entrepots.diagnostique().persiste(troisiemeDiagnostic);

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
            { details: `/api/diagnostique/${premierDiagnostic.identifiant}` },
          ],
        },
        {
          identifiant: deuxiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostique/${deuxiemeDiagnostic.identifiant}`,
            },
          ],
        },
        {
          identifiant: troisiemeDiagnostic.identifiant,
          actions: [
            {
              details: `/api/diagnostique/${troisiemeDiagnostic.identifiant}`,
            },
          ],
        },
      ]);
    });
  });
});
