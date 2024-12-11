import { Options } from './hateoas';

type ClefContexte =
  | 'demande-devenir-aidant'
  | 'demande-etre-aide'
  | 'solliciter-aide'
  | 'se-connecter'
  | 'afficher-statistiques'
  | 'afficher-annuaire-aidants'
  | 'reinitialisation-mot-de-passe'
  | 'utiliser-outil-diagnostic'
  | string;

export type ContextesUtilisateur = {
  [clef in ClefContexte]: ContexteGeneral;
};

export const contextesUtilisateur: ContextesUtilisateur = {
  'demande-devenir-aidant': {
    'finalise-creation-espace-aidant': {
      'finalise-creation-espace-aidant': {
        url: '/api/demandes/devenir-aidant/creation-espace-aidant',
        methode: 'POST',
      },
    },
    'demande-devenir-aidant': {
      'envoyer-demande-devenir-aidant': {
        url: '/api/demandes/devenir-aidant',
        methode: 'POST',
      },
      'demande-devenir-aidant': {
        url: '/api/demandes/devenir-aidant',
        methode: 'GET',
      },
    },
  },
  'demande-etre-aide': {
    'demande-etre-aide': {
      url: '/api/demandes/etre-aide',
      methode: 'GET',
    },
    'demander-aide': {
      url: '/api/demandes/etre-aide',
      methode: 'POST',
    },
  },
  'solliciter-aide': {
    'solliciter-aide': {
      url: '/api/demandes/solliciter-aide',
      methode: 'POST',
    },
  },
  'se-connecter': {
    'se-connecter': { url: '/api/token', methode: 'POST' },
    ...(process.env.PRO_CONNECT_ACTIF === 'true' && {
      'se-connecter-avec-pro-connect': {
        url: '/pro-connect/connexion',
        methode: 'GET',
      },
    }),
  },
  'afficher-statistiques': {
    'afficher-statistiques': { url: '/statistiques', methode: 'GET' },
  },
  'afficher-annuaire-aidants': {
    'afficher-annuaire-aidants': {
      url: '/api/annuaire-aidants',
      methode: 'GET',
    },
  },
  'reinitialisation-mot-de-passe': {
    'reinitialiser-mot-de-passe': {
      'reinitialiser-mot-de-passe': {
        url: '/api/utilisateur/reinitialiser-mot-de-passe',
        methode: 'PATCH',
      },
    },
    'reinitialisation-mot-de-passe': {
      'reinitialisation-mot-de-passe': {
        url: '/api/utilisateur/reinitialisation-mot-de-passe',
        methode: 'POST',
      },
    },
  },
  'utiliser-outil-diagnostic': {
    creer: {
      'creer-diagnostic': {
        methode: 'POST',
        url: '/api/diagnostic-libre-acces',
      },
    },
    afficher: {
      'afficher-diagnostic': {
        methode: 'GET',
        url: '/api/diagnostic-libre-acces/__ID__/restitution',
      },
    },
  },
};
export type ContexteSpecifique = {
  [clef: string]: Options;
};
export type ContexteGeneral = {
  [clef: string]: ContexteSpecifique | Options;
};
