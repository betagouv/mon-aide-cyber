import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../domaine/diagnostique/Diagnostique.ts";
import { Entrepot } from "../../domaine/Entrepots.ts";
import { Aggregat } from "../../domaine/Aggregat.ts";
import {
  Diagnostics,
  EntrepotDiagnostics,
} from "../../domaine/diagnostique/Diagnostics.ts";
import { FormatLien, LienRoutage } from "../../domaine/LienRoutage.ts";

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

export class APIEntrepotDiagnostique
  extends APIEntrepot<Diagnostique>
  implements EntrepotDiagnostique
{
  constructor() {
    super("diagnostique");
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
