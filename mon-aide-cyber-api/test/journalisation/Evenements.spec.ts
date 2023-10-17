import { describe, expect, it } from "vitest";
import { FournisseurHorloge } from "../../src/infrastructure/horloge/FournisseurHorloge";
import { FournisseurHorlogeDeTest } from "../infrastructure/horloge/FournisseurHorlogeDeTest";
import { diagnosticTermnine } from "../../src/journalisation/evenements";
import { EntrepotEvenementJournalMemoire } from "../infrastructure/entrepots/memoire/EntrepotsMemoire";
import crypto from "crypto";

describe("Évènements", () => {
  beforeEach(() => {
    FournisseurHorlogeDeTest.initialise(new Date());
  });

  describe("Diagnostic termininé", () => {
    it("lorsque l'évènement est consommé, il est persisté", async () => {
      const entrepot = new EntrepotEvenementJournalMemoire();

      diagnosticTermnine(entrepot).consomme({
        identifiant: crypto.randomUUID(),
        type: "DIAGNOSTIC_TERMINE",
        date: FournisseurHorloge.maintenant(),
        corps: {},
      });

      expect(await entrepot.tous()).toMatchObject([
        {
          date: FournisseurHorloge.maintenant(),
          type: "DIAGNOSTIC_TERMINE",
          donnees: {},
        },
      ]);
    });
  });
});
