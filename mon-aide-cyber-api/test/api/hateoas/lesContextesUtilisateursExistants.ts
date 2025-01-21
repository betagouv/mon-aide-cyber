import { liensPublicsAttendus } from './liensAttendus';

export const lesContextesUtilisateursExistants = [
  {
    contexte: 'Pas de contexte - Informations undefined',
    informationContexte: { contexte: undefined },
    ...liensPublicsAttendus,
  },
  {
    contexte: 'Pas de contexte - Informations vides',
    informationContexte: {},
    ...liensPublicsAttendus,
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
      'rechercher-entreprise': {
        url: '/api/recherche-entreprise',
        methode: 'GET',
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
      'se-connecter-avec-pro-connect': {
        url: '/pro-connect/connexion',
        methode: 'GET',
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
    contexte: 'Créer un diagnostic depuis l’outil',
    informationContexte: { contexte: 'utiliser-outil-diagnostic:creer' },
    liens: {
      'creer-diagnostic': {
        methode: 'POST',
        url: '/api/diagnostic-libre-acces',
      },
    },
  },
  {
    contexte: 'Afficher un diagnostic depuis l’outil',
    informationContexte: {
      contexte: `utiliser-outil-diagnostic:afficher:d01dd2da-7ddb-475c-8149-46288fc29493`,
    },
    liens: {
      'afficher-diagnostic-d01dd2da-7ddb-475c-8149-46288fc29493': {
        methode: 'GET',
        url: '/api/diagnostic-libre-acces/d01dd2da-7ddb-475c-8149-46288fc29493/restitution',
      },
    },
  },
  {
    contexte: 'Afficher un autre diagnostic depuis l’outil',
    informationContexte: {
      contexte: `utiliser-outil-diagnostic:afficher:d01dd2da-7ddb-475c-8149-46288fc29492`,
    },
    liens: {
      'afficher-diagnostic-d01dd2da-7ddb-475c-8149-46288fc29492': {
        methode: 'GET',
        url: '/api/diagnostic-libre-acces/d01dd2da-7ddb-475c-8149-46288fc29492/restitution',
      },
    },
  },
];

const contextes = lesContextesUtilisateursExistants.filter(
  (x) =>
    x.informationContexte.contexte !==
    'demande-devenir-aidant:finalise-creation-espace-aidant'
);

export const lesContextesUtilisateursNouveauParcoursExistants = [
  ...contextes,
  {
    contexte: 'Demande devenir Aidant - Création de l’espace Aidant',
    informationContexte: {
      contexte: 'demande-devenir-aidant:finalise-creation-espace-aidant',
    },
    liens: {
      'finalise-creation-nouvel-espace-aidant': {
        url: '/api/demandes/devenir-aidant/creation-espace-aidant',
        methode: 'POST',
      },
    },
  },
];
