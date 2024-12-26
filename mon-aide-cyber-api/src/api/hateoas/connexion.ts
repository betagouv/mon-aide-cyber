import { ContexteSpecifique } from './contextesUtilisateur';

export const seConnecter: ContexteSpecifique = {
  'se-connecter': { url: '/api/token', methode: 'POST' },
};
export const seConnecterAveProConnect: ContexteSpecifique = {
  'se-connecter-avec-pro-connect': {
    url: '/pro-connect/connexion',
    methode: 'GET',
  },
};
export const seDeconnecter: ContexteSpecifique = {
  'se-deconnecter': {
    url: '/api/token',
    methode: 'DELETE',
    typeAppel: 'API',
  },
};
export const seDeconnecterDeProConnect: ContexteSpecifique = {
  'se-deconnecter': {
    url: '/pro-connect/deconnexion',
    methode: 'GET',
    typeAppel: 'DIRECT',
  },
};
