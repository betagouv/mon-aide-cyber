export type Utilisateur = {
  nomPrenom: string;
};

export interface EntrepotAuthentification {
  connexion(identifiants: {
    motDePasse: string;
    identifiant: string;
  }): Promise<Utilisateur>;

  utilisateurAuthentifie(): Promise<Utilisateur>;
}
