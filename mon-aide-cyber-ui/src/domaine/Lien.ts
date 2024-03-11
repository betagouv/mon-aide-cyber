export type Lien = {
  url: string;
  methode?: string;
  contentType?: string;
  route?: string;
};
export type Liens = Record<Action | string, Lien>;
export type ReponseHATEOAS = {
  liens: Liens;
};
export type Action =
  | 'afficher-diagnostic'
  | 'afficher-profil'
  | 'afficher-tableau-de-bord'
  | 'creer-espace-aidant'
  | 'lancer-diagnostic'
  | 'modifier-diagnostic'
  | 'modifier-mot-de-passe'
  | 'restitution-json'
  | 'restitution-pdf'
  | 'se-connecter'
  | 'se-deconnecter';
