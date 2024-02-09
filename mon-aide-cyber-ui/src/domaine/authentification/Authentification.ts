import { ReponseHATEOAS } from '../Actions.ts';

export type ReponseAuthentification = ReponseHATEOAS & Utilisateur;

export type Utilisateur = { nomPrenom: string };

export interface EntrepotAuthentification {
  connexion(identifiants: {
    motDePasse: string;
    identifiant: string;
  }): Promise<ReponseAuthentification>;

  utilisateurAuthentifie(): Promise<Utilisateur>;

  utilisateurAuthentifieSync(): Utilisateur | null;
}
