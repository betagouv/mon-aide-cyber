import { ContexteSpecifique } from './contextesUtilisateur';

export const lancerDiagnostic: ContexteSpecifique = {
  'lancer-diagnostic': {
    url: '/api/diagnostic',
    methode: 'POST',
  },
};
export const afficherTableauDeBord: ContexteSpecifique = {
  'afficher-tableau-de-bord': {
    url: '/api/espace-aidant/tableau-de-bord',
    methode: 'GET',
  },
};
export const afficherPreferences: ContexteSpecifique = {
  'afficher-preferences': {
    url: '/api/aidant/preferences',
    methode: 'GET',
  },
};
export const afficherProfil: ContexteSpecifique = {
  'afficher-profil': {
    url: '/api/profil',
    methode: 'GET',
  },
};
export const modifierProfil: ContexteSpecifique = {
  'modifier-profil': {
    url: '/api/profil',
    methode: 'PATCH',
  },
};
export const modifierMotDePasse: ContexteSpecifique = {
  'modifier-mot-de-passe': {
    url: '/api/profil/modifier-mot-de-passe',
    methode: 'POST',
  },
};

export const modifierPreferences: ContexteSpecifique = {
  'modifier-preferences': {
    url: '/api/aidant/preferences',
    methode: 'PATCH',
  },
};
