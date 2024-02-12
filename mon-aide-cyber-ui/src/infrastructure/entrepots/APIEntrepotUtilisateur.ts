import {
  EntrepotUtilisateur,
  FinalisationCompte,
} from '../../domaine/utilisateur/Utilisateur.ts';
import { ParametresAPI } from '../../domaine/diagnostic/ParametresAPI.ts';
import { ReponseHATEOAS } from '../../domaine/Actions.ts';

export class APIEntrepotUtilisateur implements EntrepotUtilisateur {
  finaliseCreationCompte(
    parametresAPI: ParametresAPI,
    finalisationCompte: FinalisationCompte,
  ): Promise<ReponseHATEOAS> {
    return fetch(parametresAPI.url, {
      method: parametresAPI.methode,
      body: JSON.stringify(finalisationCompte),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((reponse) => reponse.json() as unknown as ReponseHATEOAS)
      .catch((erreur) => Promise.reject(erreur));
  }
}
