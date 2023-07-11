import { Constructeur } from "./Constructeur";
import { ActionsDiagnostics } from "../../src/domaine/Actions";
import { Diagnostics } from "../../src/domaine/diagnostic/Diagnostics";
import { Diagnostic } from "../../src/domaine/diagnostic/Diagnostic";

class ConstructeurDiagnostics implements Constructeur<Diagnostics> {
  private actions: ActionsDiagnostics[] = [];

  constructor(private readonly diagnostics: Diagnostic[]) {}

  construis(): Diagnostics {
    return this.diagnostics.map((diagnostic) => ({
      identifiant: diagnostic.identifiant,
      actions: this.actions.map((action) => ({
        [action.valueOf()]: `/api/diagnostic/${diagnostic.identifiant}`,
      })),
    })) as unknown as Diagnostics;
  }

  avecLesActions(actions: ActionsDiagnostics[]): ConstructeurDiagnostics {
    this.actions = actions;
    return this;
  }
}

export const lesDiagnostics = (
  diagnostics: Diagnostic[],
): ConstructeurDiagnostics => new ConstructeurDiagnostics(diagnostics);
