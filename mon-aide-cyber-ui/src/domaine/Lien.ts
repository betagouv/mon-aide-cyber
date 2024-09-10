import { UUID } from '../types/Types';

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
  | `afficher-diagnostic-${UUID}`
  | 'afficher-profil'
  | 'afficher-tableau-de-bord'
  | 'creer-espace-aidant'
  | 'demander-aide'
  | 'demande-devenir-aidant'
  | 'demande-etre-aide'
  | 'envoyer-demande-devenir-aidant'
  | 'lancer-diagnostic'
  | 'modifier-diagnostic'
  | 'modifier-mot-de-passe'
  | 'restitution-json'
  | 'restitution-pdf'
  | 'se-connecter'
  | 'se-deconnecter';
