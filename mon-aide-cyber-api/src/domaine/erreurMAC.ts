export type Contexte =
  | 'Accès diagnostic'
  | 'Ajout réponse au diagnostic'
  | 'Demande la restitution'
  | 'Lance le diagnostic'
  | 'Accède aux diagnostics'
  | "Demande d'Authentification";

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
