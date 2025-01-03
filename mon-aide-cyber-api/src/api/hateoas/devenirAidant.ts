import { ContexteSpecifique } from './contextesUtilisateur';
import { Options } from './hateoas';

export const finaliseCreationEspaceAidant: ContexteSpecifique = {
  'finalise-creation-espace-aidant': {
    'finalise-creation-espace-aidant': {
      url: '/api/demandes/devenir-aidant/creation-espace-aidant',
      methode: 'POST',
    },
  },
};
export const demandeDevenirAidant: ContexteSpecifique & {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': Options;
    'demande-devenir-aidant': Options;
    'rechercher-entreprise': Options;
  };
} = {
  'demande-devenir-aidant': {
    'envoyer-demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'POST',
    },
    'demande-devenir-aidant': {
      url: '/api/demandes/devenir-aidant',
      methode: 'GET',
    },
    'rechercher-entreprise': {
      url: '/api/recherche-entreprise',
      methode: 'GET',
    },
  },
};
