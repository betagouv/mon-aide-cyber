import { describe, expect, it } from "vitest";
import { actions, routage } from "../../src/domaine/Actions";

describe("Les actions possibles retournées par l’API", () => {
  it("sont traduites pour le routage de l’UI", () => {
    expect(
      routage
        .pour(
          [
            { autre: "/api/lien/routage/autre" },
            { details: "/api/lien/routage/interne" },
          ],
          actions.diagnostics().AFFICHER,
        )
        .lien(),
    ).toBe("/lien/routage/interne");
  });
});
