import { ContexteSpecifique } from './contextesUtilisateur';

export const demandeEtreAide: ContexteSpecifique = {
  'demande-etre-aide': {
    url: '/api/demandes/etre-aide',
    methode: 'GET',
  },
};
export const demandeAide: ContexteSpecifique = {
  'demander-aide': {
    url: '/api/demandes/etre-aide',
    methode: 'POST',
  },
};
