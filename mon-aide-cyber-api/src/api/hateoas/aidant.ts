import { ContexteSpecifique } from './contextesUtilisateur';

export const afficherPreferences: ContexteSpecifique = {
  'afficher-preferences': {
    url: '/api/aidant/preferences',
    methode: 'GET',
  },
};

export const modifierPreferences: ContexteSpecifique = {
  'modifier-preferences': {
    url: '/api/aidant/preferences',
    methode: 'PATCH',
  },
};
