import { Aggregat } from "../../domaine/Aggregat.ts";
import { Entrepot } from "../../domaine/Entrepots.ts";
import {
  Diagnostics,
  EntrepotDiagnostics,
} from "../../domaine/diagnostic/Diagnostics.ts";

export abstract class APIEntrepot<T extends Aggregat> implements Entrepot<T> {
  protected constructor(private readonly chemin: string) {}

  lis(identifiant: string | undefined = undefined): Promise<T> {
    const partieIdentifiant =
      identifiant !== undefined ? `/${identifiant}` : "";
    return fetch(`/api/${this.chemin}${partieIdentifiant}`).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return this.transcris(reponse.json());
    });
  }

  protected abstract transcris(json: Promise<any>): Promise<T>;

  persiste() {
    return fetch(`/api/${this.chemin}`, { method: "POST" });
  }
}

export class APIEntrepotDiagnostics
  extends APIEntrepot<Diagnostics>
  implements EntrepotDiagnostics
{
  constructor() {
    super("diagnostics");
  }

  tous(): Promise<Diagnostics> {
    return this.lis();
  }

  protected transcris(json: Promise<any>): Promise<Diagnostics> {
    return json;
  }
}
