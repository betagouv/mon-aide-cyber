import { Aggregat } from "../../../src/domaine/Aggregat";
import {
  Diagnostic,
  EntrepotDiagnostic,
} from "../../../src/domaine/diagnostic/Diagnostic.ts";
import { Entrepot, Lien } from "../../../src/domaine/Entrepots";
import { unDiagnostic } from "../../consructeurs/constructeurDiagnostic.ts";

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  private entites: T[] = [];

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
  lancer(): Promise<Lien> {
    const diagnostic = unDiagnostic().construis();
    return this.persiste(diagnostic).then(
      () => new Lien(`/api/diagnostic/${diagnostic.identifiant}`),
    );
  }
}
