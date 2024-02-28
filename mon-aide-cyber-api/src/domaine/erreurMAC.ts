export type Contexte =
  | 'Accès diagnostic'
  | 'Ajout réponse au diagnostic'
  | 'Demande la restitution'
  | 'Lance le diagnostic'
  | 'Accède aux diagnostics'
  | "Demande d'Authentification"
  | "Crée l'espace Aidant"
  | 'Envoi un message de contact'
  | 'Accède au profil'
  | "Accède aux informations de l'utilisateur";

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
