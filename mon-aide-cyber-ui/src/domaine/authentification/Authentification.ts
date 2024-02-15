import { ReponseHATEOAS } from '../Actions.ts';

export type ReponseAuthentification = ReponseHATEOAS & Utilisateur;

export type Utilisateur = { nomPrenom: string };

export interface EntrepotAuthentification {
  utilisateurAuthentifie(): Promise<Utilisateur>;

  utilisateurAuthentifieSync(): Utilisateur | null;
}
