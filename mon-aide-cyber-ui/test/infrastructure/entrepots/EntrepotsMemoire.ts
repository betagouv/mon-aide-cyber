import { Aggregat } from "../../../src/domaine/Aggregat";
import {
  Diagnostic,
  EntrepotDiagnostic,
} from "../../../src/domaine/diagnostic/Diagnostic.ts";
import { Entrepot } from "../../../src/domaine/Entrepots";
import { unDiagnostic } from "../../consructeurs/constructeurDiagnostic.ts";
import { LienRoutage } from "../../../src/domaine/LienRoutage.ts";
import {
  Diagnostics,
  EntrepotDiagnostics,
} from "../../../src/domaine/diagnostic/Diagnostics.ts";

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  protected entites: T[] = [];

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.find(
      (entite) => entite.identifiant === identifiant,
    );
    if (entiteTrouvee !== undefined) {
      return Promise.resolve(entiteTrouvee);
    }
    return Promise.reject({ message: `Entitée ${identifiant} non trouvée.` });
  }

  async persiste(entite: T) {
    this.entites.push(entite);
  }
}

export class EntrepotDiagnosticMemoire
  extends EntrepotMemoire<Diagnostic>
  implements EntrepotDiagnostic
{
  lancer(): Promise<LienRoutage> {
    const diagnostic = unDiagnostic().construis();
    return this.persiste(diagnostic).then(
      () => new LienRoutage(`/api/diagnostic/${diagnostic.identifiant}`),
    );
  }
}

export class EntrepotDiagnosticsMemoire
  extends EntrepotMemoire<Diagnostics>
  implements EntrepotDiagnostics
{
  tous(): Promise<Diagnostics> {
    return Promise.resolve(
      this.entites.flatMap((diagnostic) =>
        diagnostic.map((diag) => diag),
      ) as Diagnostics,
    );
  }
}
