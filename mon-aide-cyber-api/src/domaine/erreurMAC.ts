export type Contexte =
  | 'Accède au profil'
  | 'Accède au Tableau de Bord'
  | 'Accède aux diagnostics'
  | "Accède aux informations de l'utilisateur"
  | 'Accède aux préférences de l’Aidant'
  | 'Accès diagnostic'
  | 'Ajout réponse au diagnostic'
  | 'Authentification ProConnect'
  | "Crée l'espace Aidant"
  | "Demande d'aide"
  | "Demande d'Authentification"
  | 'Demande devenir Aidant'
  | 'Demande devenir Aidant - crée espace Aidant'
  | 'Demande la restitution'
  | 'Envoi un message de contact'
  | 'Lance le diagnostic'
  | 'Modifie le mot de passe'
  | 'Modifie le profil Aidant'
  | 'Modifie les préférences de l’Aidant'
  | "Recherche d'un Aidé"
  | 'Réinitialisation mot de passe'
  | 'Valide les CGU';

export class ErreurMAC<T extends Error> extends Error {
  private constructor(
    public readonly contexte: string,
    public readonly erreurOriginelle: T
  ) {
    super(erreurOriginelle.message);
  }

  public static cree<T extends Error>(contexte: Contexte, erreur: T) {
    return new ErreurMAC<T>(contexte, erreur);
  }
}
