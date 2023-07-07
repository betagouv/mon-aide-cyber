import {
  Diagnostic,
  EntrepotDiagnostic,
} from "../../domaine/diagnostic/Diagnostic.ts";

export class APIEntrepotDiagnostic implements EntrepotDiagnostic {
  lis(identifiant: string): Promise<Diagnostic> {
    return fetch(`/api/diagnostic/${identifiant}`).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return reponse.json();
    });
  }
}
