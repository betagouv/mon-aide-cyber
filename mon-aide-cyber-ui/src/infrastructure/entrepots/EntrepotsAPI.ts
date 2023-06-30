import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../domaine/diagnostique/Diagnostique.ts";

export class APIEntrepotDiagnostique implements EntrepotDiagnostique {
  lis(identifiant: string): Promise<Diagnostique> {
    return fetch(`/api/diagnostiques/${identifiant}`).then((reponse) =>
      reponse.json(),
    );
  }
}
