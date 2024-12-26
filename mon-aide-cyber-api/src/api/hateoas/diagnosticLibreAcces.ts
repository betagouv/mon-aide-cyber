import { ContexteSpecifique } from './contextesUtilisateur';

export const creerDiagnostic: ContexteSpecifique = {
  creer: {
    'creer-diagnostic': {
      methode: 'POST',
      url: '/api/diagnostic-libre-acces',
    },
  },
};
export const afficherDiagnostic: ContexteSpecifique = {
  afficher: {
    'afficher-diagnostic': {
      methode: 'GET',
      url: '/api/diagnostic-libre-acces/__ID__/restitution',
    },
  },
};
