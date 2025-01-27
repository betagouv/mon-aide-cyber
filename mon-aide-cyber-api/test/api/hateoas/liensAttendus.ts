import { ReponseHATEOAS } from '../../../src/api/hateoas/hateoas';

export const liensPublicsAttendus: ReponseHATEOAS = {
  liens: {
    'demande-devenir-aidant': {
      methode: 'GET',
      url: '/api/demandes/devenir-aidant',
    },
    'envoyer-demande-devenir-aidant': {
      methode: 'POST',
      url: '/api/demandes/devenir-aidant',
    },
    'rechercher-entreprise': {
      url: '/api/recherche-entreprise',
      methode: 'GET',
    },
    'demande-etre-aide': {
      methode: 'GET',
      url: '/api/demandes/etre-aide',
    },
    'demander-aide': {
      methode: 'POST',
      url: '/api/demandes/etre-aide',
    },
    'se-connecter': {
      methode: 'POST',
      url: '/api/token',
    },
    'se-connecter-avec-pro-connect': {
      methode: 'GET',
      url: '/pro-connect/connexion',
    },
  },
};

export const liensPublicsAttendusNouveauParcours: ReponseHATEOAS = {
  liens: {
    'nouvelle-demande-devenir-aidant': {
      methode: 'GET',
      url: '/api/demandes/devenir-aidant',
    },
    'envoyer-demande-devenir-aidant': {
      methode: 'POST',
      url: '/api/demandes/devenir-aidant',
    },
    'rechercher-entreprise': {
      url: '/api/recherche-entreprise',
      methode: 'GET',
    },
    'demande-etre-aide': {
      methode: 'GET',
      url: '/api/demandes/etre-aide',
    },
    'demander-aide': {
      methode: 'POST',
      url: '/api/demandes/etre-aide',
    },
    'se-connecter': {
      methode: 'POST',
      url: '/api/token',
    },
    'se-connecter-avec-pro-connect': {
      methode: 'GET',
      url: '/pro-connect/connexion',
    },
  },
};
