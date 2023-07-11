import { Aggregat } from "../../../src/domaine/Aggregat";
import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../../src/domaine/diagnostique/Diagnostique";
import { Entrepot } from "../../../src/domaine/Entrepots";
import { unDiagnostique } from "../../consructeurs/constructeurDiagnostique.ts";
import {
  Diagnostics,
  EntrepotDiagnostics,
} from "../../../src/domaine/diagnostique/Diagnostics.ts";
import { LienRoutage } from "../../../src/domaine/LienRoutage.ts";

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

export class EntrepotDiagnostiqueMemoire
  extends EntrepotMemoire<Diagnostique>
  implements EntrepotDiagnostique
{
  lancer(): Promise<LienRoutage> {
    const diagnostic = unDiagnostique().construis();
    return this.persiste(diagnostic).then(
      () => new LienRoutage(`/api/diagnostique/${diagnostic.identifiant}`),
    );
  }
}

export class EntrepotDiagnosticsMemoire
  extends EntrepotMemoire<Diagnostics>
  implements EntrepotDiagnostics
{
  tous(): Promise<Diagnostics> {
    console.log(this.entites);
    return Promise.resolve(
      this.entites.flatMap((diagnostic) =>
        diagnostic.map((diag) => diag),
      ) as Diagnostics,
    );
  }
}
