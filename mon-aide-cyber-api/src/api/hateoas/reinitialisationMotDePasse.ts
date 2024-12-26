import { ContexteSpecifique } from './contextesUtilisateur';

export const reinitialiserMotDePasse: ContexteSpecifique = {
  'reinitialiser-mot-de-passe': {
    'reinitialiser-mot-de-passe': {
      url: '/api/utilisateur/reinitialiser-mot-de-passe',
      methode: 'PATCH',
    },
  },
};
export const reinitialisationMotDePasse: ContexteSpecifique = {
  'reinitialisation-mot-de-passe': {
    'reinitialisation-mot-de-passe': {
      url: '/api/utilisateur/reinitialisation-mot-de-passe',
      methode: 'POST',
    },
  },
};
