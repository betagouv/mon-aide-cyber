export interface EntrepotAuthentification {
  connexion(identifiants: { motDePasse: string; identifiant: string }): void;
}
