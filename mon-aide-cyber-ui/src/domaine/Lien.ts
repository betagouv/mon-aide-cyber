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
  | 'creer-espace-aidant'
  | 'lancer-diagnostic'
  | 'modifier-diagnostic'
  | 'restitution-pdf'
  | 'restitution-json';
