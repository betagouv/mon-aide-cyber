import { ReponseHATEOAS } from '../../../src/api/hateoas/hateoas';

export const liensPublicsAttendus: ReponseHATEOAS = {
  liens: {
    'demande-devenir-aidant': {
      methode: 'GET',
      url: '/api/demandes/devenir-aidant',
    },
    'demande-etre-aide': {
      methode: 'GET',
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
