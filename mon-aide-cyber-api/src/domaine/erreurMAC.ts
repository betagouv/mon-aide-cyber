type Contexte =
  | 'Accès diagnostic'
  | 'Ajout réponse au diagnostic'
  | 'Termine le diagnostic'
  | 'Lance le diagnostic'
  | "Demande d'Authentification";

export class ErreurMAC implements Error {
  private constructor(
    public readonly contexte: string,
    public readonly erreurOriginelle: Error,
    public readonly message = '',
    public readonly name = '',
  ) {
    this.name = erreurOriginelle.name;
    this.message = erreurOriginelle.message;
  }

  public static cree(contexte: Contexte, erreur: Error) {
    return new ErreurMAC(contexte, erreur);
  }
}
