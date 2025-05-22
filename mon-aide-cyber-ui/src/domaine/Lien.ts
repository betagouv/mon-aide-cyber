import { UUID } from '../types/Types';

export type Lien = {
  url: string;
  methode?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  contentType?: string;
  route?: string;
  typeAppel?: 'API' | 'DIRECT';
};
export type Liens = Record<Action | string, Lien>;
export type ReponseHATEOAS = {
  liens: Liens;
};
export type Action =
  | `afficher-diagnostic-${UUID}`
  | 'repondre-diagnostic'
  | 'afficher-annuaire-aidants'
  | 'afficher-guide-aidant-cyber'
  | 'afficher-preferences'
  | 'afficher-profil'
  | 'afficher-tableau-de-bord'
  | 'valider-signature-cgu'
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
  | 'rechercher-entreprise'
  | 'restitution-json'
  | 'restitution-pdf'
  | 'se-connecter'
  | 'se-connecter-avec-pro-connect'
  | 'se-deconnecter'
  | 'afficher-statistiques'
  | 'afficher-associations'
  | 'reinitialisation-mot-de-passe'
  | 'reinitialiser-mot-de-passe'
  | 'creer-diagnostic'
  | 'valider-profil-aidant'
  | 'valider-profil-utilisateur-inscrit';
