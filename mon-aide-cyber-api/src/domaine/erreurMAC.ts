export type Contexte =
  | 'Accède au profil'
  | 'Accède au Tableau de Bord'
  | 'Accède aux diagnostics'
  | "Accède aux informations de l'utilisateur"
  | 'Accès diagnostic'
  | 'Ajout réponse au diagnostic'
  | "Crée l'espace Aidant"
  | "Demande d'aide"
  | "Demande d'Authentification"
  | 'Demande la restitution'
  | 'Envoi un message de contact'
  | 'Génération restitution format PDF'
  | 'Lance le diagnostic'
  | 'Modifie le mot de passe'
  | "Recherche d'un Aidé";

export class ErreurMAC extends Error {
  private constructor(
    public readonly contexte: string,
    public readonly erreurOriginelle: Error,
  ) {
    super(erreurOriginelle.message);
  }

  public static cree(contexte: Contexte, erreur: Error) {
    return new ErreurMAC(contexte, erreur);
  }
}
