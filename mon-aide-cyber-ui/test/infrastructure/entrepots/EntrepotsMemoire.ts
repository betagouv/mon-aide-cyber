import { Aggregat } from "../../../src/domaine/Aggregat";
import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../../src/domaine/diagnostique/Diagnostique";
import { Entrepot, Lien } from "../../../src/domaine/Entrepots";
import { unDiagnostique } from "../../consructeurs/constructeurDiagnostique.ts";

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

export class EntrepotDiagnostiqueMemoire
  extends EntrepotMemoire<Diagnostique>
  implements EntrepotDiagnostique
{
  lancer(): Promise<Lien> {
    const diagnostic = unDiagnostique().construis();
    return this.persiste(diagnostic).then(
      () => new Lien(`/api/diagnostique/${diagnostic.identifiant}`),
    );
  }
}
