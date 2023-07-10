import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../domaine/diagnostique/Diagnostique.ts";
import { Entrepot, FormatLien, Lien } from "../../domaine/Entrepots.ts";
import { Aggregat } from "../../domaine/Aggregat.ts";

abstract class APIEntrepot<T extends Aggregat> implements Entrepot<T> {
  protected constructor(private readonly chemin: string) {}

  lis(identifiant: string): Promise<T> {
    return fetch(`/api/${this.chemin}/${identifiant}`).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return reponse.json();
    });
  }

  persiste() {
    return fetch(`/api/${this.chemin}`, { method: "POST" });
  }
}

export class APIEntrepotDiagnostique
  extends APIEntrepot<Diagnostique>
  implements EntrepotDiagnostique
{
  constructor() {
    super("diagnostique");
  }

  lancer(): Promise<Lien> {
    return super
      .persiste()
      .then((reponse) => new Lien(reponse.headers.get("Link") as FormatLien));
  }
}
