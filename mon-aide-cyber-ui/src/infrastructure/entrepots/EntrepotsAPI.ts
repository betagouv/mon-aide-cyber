import {
  Diagnostique,
  EntrepotDiagnostique,
} from "../../domaine/diagnostique/Diagnostique.ts";

export class APIEntrepotDiagnostique implements EntrepotDiagnostique {
  lis(identifiant: string): Promise<Diagnostique> {
    return fetch(`/api/diagnostique/${identifiant}`).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return reponse.json();
    });
  }
}
