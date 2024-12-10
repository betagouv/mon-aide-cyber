import { UUID } from '../types/Types';

export type Lien = {
  url: string;
  methode?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  contentType?: string;
  route?: string;
};
export type Liens = Record<Action | string, Lien>;
export type ReponseHATEOAS = {
  liens: Liens;
};
export type Action =
  | `afficher-diagnostic-${UUID}`
  | 'repondre-diagnostic'
  | 'afficher-preferences'
  | 'afficher-profil'
  | 'afficher-tableau-de-bord'
  | 'afficher-annuaire-aidants'
  | 'creer-espace-aidant'
  | 'demander-aide'
  | 'solliciter-aide'
  | 'demande-devenir-aidant'
  | 'demande-etre-aide'
  | 'envoyer-demande-devenir-aidant'
  | 'finalise-creation-espace-aidant'
  | 'lancer-diagnostic'
  | 'modifier-diagnostic'
  | 'modifier-mot-de-passe'
  | 'modifier-preferences'
  | 'modifier-profil'
  | 'restitution-json'
  | 'restitution-pdf'
  | 'se-connecter'
  | 'se-connecter-avec-pro-connect'
  | 'se-deconnecter'
  | 'afficher-statistiques'
  | 'reinitialisation-mot-de-passe'
  | 'reinitialiser-mot-de-passe'
  | 'creer-diagnostic';
