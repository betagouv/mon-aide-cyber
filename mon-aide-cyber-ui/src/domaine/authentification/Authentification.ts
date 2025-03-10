import { ReponseHATEOAS } from '../Lien.ts';

export type Utilisateur = { nomPrenom: string; email: string };

export type ReponseAuthentification = ReponseHATEOAS & Utilisateur;
export type ReponseUtilisateur = ReponseAuthentification;
