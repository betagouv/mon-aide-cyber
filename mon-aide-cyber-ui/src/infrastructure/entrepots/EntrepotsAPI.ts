import {
  ActionDiagnostic,
  Diagnostic,
  EntrepotDiagnostic,
  Reponse,
} from "../../domaine/diagnostic/Diagnostic.ts";
import { Aggregat } from "../../domaine/Aggregat.ts";
import { FormatLien, LienRoutage } from "../../domaine/LienRoutage.ts";
import { Entrepot } from "../../domaine/Entrepots.ts";
import {
  Diagnostics,
  EntrepotDiagnostics,
} from "../../domaine/diagnostic/Diagnostics.ts";

abstract class APIEntrepot<T extends Aggregat> implements Entrepot<T> {
  protected constructor(private readonly chemin: string) {}

  lis(identifiant: string | undefined = undefined): Promise<T> {
    const partieIdentifiant =
      identifiant !== undefined ? `/${identifiant}` : "";
    return fetch(`/api/${this.chemin}${partieIdentifiant}`).then((reponse) => {
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

  lancer(): Promise<LienRoutage> {
    return super
      .persiste()
      .then((reponse) => {
        const lien = reponse.headers.get("Link");
        return lien !== null
          ? new LienRoutage(lien as FormatLien)
          : Promise.reject(
              "Impossible de récupérer le lien vers le diagnostic",
            );
      })
      .catch((erreur) =>
        Promise.reject({
          message: `Lors de la création ou de la récupération du diagnostic pour les raisons suivantes : '${erreur}'`,
        }),
      );
  }

  repond(action: ActionDiagnostic, reponseDonnee: Reponse): Promise<void> {
    return fetch(action.ressource.url, {
      method: action.ressource.methode,
      body: JSON.stringify({
        chemin: action.chemin,
        identifiant: reponseDonnee.identifiantQuestion,
        reponse: reponseDonnee.reponseDonnee,
      }),
      headers: { "Content-Type": "application/json" },
    }).then();
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
}
