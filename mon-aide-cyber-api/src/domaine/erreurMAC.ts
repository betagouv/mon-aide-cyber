export type Contexte =
  | 'Accède au profil'
  | 'Accède au référentiel associatif'
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
  | 'Demande de déconnexion'
  | 'Demande devenir Aidant'
  | 'Demande devenir Aidant - crée espace Aidant'
  | 'Demande la restitution'
  | 'Envoi un message de contact'
  | 'Exécution requête HTTP'
  | 'Lance le diagnostic'
  | 'Modifie le mot de passe'
  | 'Modifie le profil Aidant'
  | 'Modifie les préférences de l’Aidant'
  | "Postuler à une demande d'aide"
  | "Recherche d'un Aidé"
  | 'Réinitialisation mot de passe'
  | 'Valide les CGU'
  | 'Valide le profil Aidant'
  | 'Valide le profil Utilisateur Inscrit';

export class ErreurMAC<T extends Error> extends Error {
  private constructor(
    public readonly contexte: string,
    public readonly erreurOriginelle: T
  ) {
    super(erreurOriginelle.message, { cause: erreurOriginelle });
  }

  public static cree<T extends Error>(contexte: Contexte, erreur: T) {
    return new ErreurMAC<T>(contexte, erreur);
  }
}
