import {
  Diagnostic,
  EntrepotDiagnostic,
} from "../../domaine/diagnostic/Diagnostic.ts";
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

export class APIEntrepotDiagnostic
  extends APIEntrepot<Diagnostic>
  implements EntrepotDiagnostic
{
  constructor() {
    super("diagnostic");
  }

  lancer(): Promise<Lien> {
    return super
      .persiste()
      .then((reponse) => new Lien(reponse.headers.get("Link") as FormatLien));
  }
}
