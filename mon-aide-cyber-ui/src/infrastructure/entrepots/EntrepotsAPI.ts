import {
  EntrepotAuthentification,
  Utilisateur,
} from '../../domaine/authentification/Authentification.ts';
export type Identifiants = {
  motDePasse: string;
  identifiant: string;
};
export class EntrepotAuthentificationSession
  implements EntrepotAuthentification
{
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
