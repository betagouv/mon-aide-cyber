export const lesContextesUtilisateursExistants = [
  {
    contexte: 'Pas de contexte - Informations undefined',
    informationContexte: { contexte: undefined },
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
    },
  },
  {
    contexte: 'Pas de contexte - Informations vides',
    informationContexte: {},
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
    },
  },
  {
    contexte: 'Demande devenir Aidant - Effectuer la demande',
    informationContexte: {
      contexte: 'demande-devenir-aidant:demande-devenir-aidant',
    },
    liens: {
      'demande-devenir-aidant': {
        url: '/api/demandes/devenir-aidant',
        methode: 'GET',
      },
      'envoyer-demande-devenir-aidant': {
        url: '/api/demandes/devenir-aidant',
        methode: 'POST',
      },
    },
  },
  {
    contexte: 'Demande devenir Aidant - Création de l’espace Aidant',
    informationContexte: {
      contexte: 'demande-devenir-aidant:finalise-creation-espace-aidant',
    },
    liens: {
      'finalise-creation-espace-aidant': {
        url: '/api/demandes/devenir-aidant/creation-espace-aidant',
        methode: 'POST',
      },
    },
  },
  {
    contexte: 'Demande être aidé',
    informationContexte: {
      contexte: 'demande-etre-aide',
    },
    liens: {
      'demande-etre-aide': {
        url: '/api/demandes/etre-aide',
        methode: 'GET',
      },
      'demander-aide': {
        url: '/api/demandes/etre-aide',
        methode: 'POST',
      },
    },
  },
  {
    contexte: 'Se connecter',
    informationContexte: {
      contexte: 'se-connecter',
    },
    liens: {
      'se-connecter': {
        url: '/api/token',
        methode: 'POST',
      },
    },
  },
  {
    contexte: 'Afficher les statistiques',
    informationContexte: {
      contexte: 'afficher-statistiques',
    },
    liens: {
      'afficher-statistiques': {
        url: '/statistiques',
        methode: 'GET',
      },
    },
  },
  {
    contexte: 'Afficher l’annuaire Aidants',
    informationContexte: {
      contexte: 'afficher-annuaire-aidants',
    },
    liens: {
      'afficher-annuaire-aidants': {
        url: '/api/annuaire-aidants',
        methode: 'GET',
      },
    },
  },
  {
    contexte: 'Réinitialiser son mot de passe',
    informationContexte: {
      contexte: 'reinitialisation-mot-de-passe:reinitialiser-mot-de-passe',
    },
    liens: {
      'reinitialiser-mot-de-passe': {
        url: '/api/utilisateur/reinitialiser-mot-de-passe',
        methode: 'PATCH',
      },
    },
  },
  {
    contexte: 'Réinitialisation mot de passe',
    informationContexte: {
      contexte: 'reinitialisation-mot-de-passe:reinitialisation-mot-de-passe',
    },
    liens: {
      'reinitialisation-mot-de-passe': {
        url: '/api/utilisateur/reinitialisation-mot-de-passe',
        methode: 'POST',
      },
    },
  },
  {
    contexte: 'Créer un auto diagnostic',
    informationContexte: { contexte: 'creer-auto-diagnostic' },
    liens: {
      'creer-auto-diagnostic': {
        methode: 'POST',
        url: '/api/auto-diagnostic',
      },
    },
  },
];
