import { Aggregat } from '../../domaine/Aggregat.ts';
import { Entrepot } from '../../domaine/Entrepots.ts';
import {
  Diagnostics,
  EntrepotDiagnostics,
} from '../../domaine/diagnostic/Diagnostics.ts';
import {
  EntrepotAuthentification,
  ReponseAuthentification,
  Utilisateur,
} from '../../domaine/authentification/Authentification.ts';
import { ParametresAPI } from '../../domaine/diagnostic/ParametresAPI.ts';

export abstract class APIEntrepot<T extends Aggregat> implements Entrepot<T> {
  protected constructor(private readonly chemin: string) {}

  lis(identifiant: string | undefined = undefined): Promise<T> {
    const partieIdentifiant =
      identifiant !== undefined ? `/${identifiant}` : '';
    return fetch(`/api/${this.chemin}${partieIdentifiant}`).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((reponse) => Promise.reject(reponse));
      }
      return this.transcris(reponse.json());
    });
  }

  protected abstract transcris(json: Promise<any>): Promise<T>;

  persiste(parametresAPI: ParametresAPI | undefined) {
    if (parametresAPI) {
      return fetch(parametresAPI.url, { method: parametresAPI.methode });
    }
    return fetch(`/api/${this.chemin}`, { method: 'POST' });
  }
}

export class APIEntrepotDiagnostics
  extends APIEntrepot<Diagnostics>
  implements EntrepotDiagnostics
{
  constructor() {
    super('diagnostics');
  }

  tous(): Promise<Diagnostics> {
    return this.lis();
  }

  protected transcris(json: Promise<any>): Promise<Diagnostics> {
    return json;
  }
}

export class APIEntrepotAuthentification implements EntrepotAuthentification {
  connexion(identifiants: {
    motDePasse: string;
    identifiant: string;
  }): Promise<ReponseAuthentification> {
    return fetch(`/api/token`, {
      method: 'POST',
      body: JSON.stringify(identifiants),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (reponse) => {
        const reponseJSON = await reponse.json();
        if (reponse.ok) {
          const aidant = reponseJSON;
          sessionStorage.setItem('aidant', JSON.stringify(aidant));
          return Promise.resolve(aidant);
        } else {
          return Promise.reject(reponseJSON);
        }
      })
      .catch((erreur) => {
        return Promise.reject(erreur);
      });
  }

  utilisateurAuthentifie(): Promise<Utilisateur> {
    const utilisateur = this.recupereUtilisateurDansLeSessionStorage();
    if (utilisateur) {
      return Promise.resolve(utilisateur);
    }
    return Promise.reject({ message: "Vous n'êtes pas connecté." });
  }

  utilisateurAuthentifieSync(): Utilisateur | null {
    return this.recupereUtilisateurDansLeSessionStorage();
  }

  private recupereUtilisateurDansLeSessionStorage() {
    const aidant = sessionStorage.getItem('aidant');
    if (aidant) {
      return JSON.parse(aidant) as unknown as Utilisateur;
    }
    return null;
  }
}
