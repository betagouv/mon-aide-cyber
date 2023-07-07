import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../../diagnostique/Diagnostique";
import { Aggregat } from "../../../domaine/Aggregat";
import { Entrepot } from "../../../domaine/Entrepot";

export class AggregatNonTrouve implements Error {
  message: string;
  name: string;

  constructor(typeAggregat: string) {
    this.name = "";
    this.message = `Le ${typeAggregat} demandé n'existe pas.`;
  }
}

class EntrepotMemoire<T extends Aggregat> implements Entrepot<T> {
  private entites: T[] = [];

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.find(
      (entite) => entite.identifiant === identifiant,
    );
    if (entiteTrouvee !== undefined) {
      return Promise.resolve(entiteTrouvee);
    }
    throw new AggregatNonTrouve(this.typeAggregat());
  }

  async persiste(entite: T) {
    this.entites.push(entite);
  }

  typeAggregat(): string {
    throw new Error("Non implémenté");
  }
}

export class EntrepotDiagnostiqueMemoire
  extends EntrepotMemoire<Diagnostique>
  implements EntrepotDiagnostique
{
  typeAggregat(): string {
    return "diagnostique";
  }
}
