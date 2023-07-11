import { Diagnostique } from "../../src/domaine/diagnostique/Diagnostique.ts";
import { Constructeur } from "./Constructeur.ts";
import { Diagnostics } from "../../src/domaine/diagnostique/Diagnostics.ts";
import { ActionsDiagnostics } from "../../src/domaine/Actions.ts";

class ConstructeurDiagnostics implements Constructeur<Diagnostics> {
  private actions: ActionsDiagnostics[] = [];

  constructor(private readonly diagnostics: Diagnostique[]) {}

  construis(): Diagnostics {
    return this.diagnostics.map((diagnostic) => ({
      identifiant: diagnostic.identifiant,
      actions: this.actions.map((action) => ({
        [action.valueOf()]: `/api/diagnostique/${diagnostic.identifiant}`,
      })),
    })) as unknown as Diagnostics;
  }

  avecLesActions(actions: ActionsDiagnostics[]): ConstructeurDiagnostics {
    this.actions = actions;
    return this;
  }
}

export const lesDiagnostics = (
  diagnostics: Diagnostique[],
): ConstructeurDiagnostics => new ConstructeurDiagnostics(diagnostics);
