import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../../diagnostique/Diagnostique";
import { Aggregat } from "../../../domaine/Aggregat";
import { Entrepot } from "../../../domaine/Entrepot";

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  private entites: T[] = [];

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.find(
      (entite) => entite.identifiant === identifiant,
    );
    if (entiteTrouvee !== undefined) {
      return Promise.resolve(entiteTrouvee);
    }
    return Promise.reject(`Entitee ${identifiant} non trouvée.`);
  }

  async persiste(entite: T) {
    this.entites.push(entite);
  }
}

export class EntrepotDiagnostiqueMemoire
  extends EntrepotMemoire<Diagnostique>
  implements EntrepotDiagnostique {}
