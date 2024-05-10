import { UUID } from '../types/Types.ts';

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
  | `afficher-diagnostic-${UUID}`
  | 'afficher-profil'
  | 'afficher-tableau-de-bord'
  | 'creer-espace-aidant'
  | 'demander-aide'
  | 'lancer-diagnostic'
  | 'modifier-diagnostic'
  | 'modifier-mot-de-passe'
  | 'restitution-json'
  | 'restitution-pdf'
  | 'se-connecter'
  | 'se-deconnecter';
new Map([
  ['afficher-diagnostic', 'Afficher le diagnostic'],
  ['afficher-profil', 'Mon profil'],
  ['afficher-tableau-de-bord', 'Mes diagnostics'],
  ['se-connecter', 'Se connecter'],
  ['se-deconnecter', 'Se déconnecter'],
]);
