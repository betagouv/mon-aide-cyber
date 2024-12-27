import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';

export const demandeEtreAide: ContexteSpecifique = {
  'demande-etre-aide': {
    url: '/api/demandes/etre-aide',
    methode: 'GET',
  },
};
export const demandeAide: ContexteSpecifique & { 'demander-aide': Options } = {
  'demander-aide': {
    url: '/api/demandes/etre-aide',
    methode: 'POST',
  },
};
