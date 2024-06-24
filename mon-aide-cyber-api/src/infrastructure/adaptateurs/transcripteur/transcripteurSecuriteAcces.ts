import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSecuriteAcces: Thematique = {
  description:
    "La sécurité de l'information englobe la protection des données et des renseignements contre tout accès, usage, divulgation, altération, perturbation ou destruction non autorisés. Elle représente une préoccupation essentielle tant pour les individus que pour les organisations.",
  libelle: "Sécurité des accès au système d'information",
  styles: {
    navigation: 'navigation-securite-acces',
  },
  localisationIllustration:
    '/images/diagnostic/securite-acces/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant: 'acces-outil-gestion-des-comptes',
          'info-bulles': [
            'acces/gestion-comptes-entites-publiques.pug',
            'acces/gestion-comptes-active-directory.pug',
          ],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-liste-compte-utilisateurs',
          'info-bulles': ['acces/comptes-utilisateurs.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-droits-acces-utilisateurs-limites',
          'info-bulles': ['acces/droits-utilisateurs.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-utilisateurs-administrateurs-poste',
          'info-bulles': ['acces/utilisateurs-administrateurs.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-mesures-securite-robustesse-mdp',
          'info-bulles': ['acces/robustesse-mot-de-passe.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-administrateurs-informatiques-suivie-et-limitee',
          'info-bulles': ['acces/liste-comptes-administration.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-limitee',
          'info-bulles': [
            'acces/comptes-administration-limites-administration.pug',
          ],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-administrateurs-si-mesures-specifiques',

          'info-bulles': ['acces/mesures-specifiques-acces-administrateur.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
          'info-bulles': ['acces/acces-utilisateurs-donnees-sensibles.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-teletravail-acces-distants-mesures-particulieres',
          'info-bulles': ['acces/teletravail-acces-distants.pug'],
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
          perimetre: 'SYSTEME-INDUSTRIEL',
        },
      ],
    },
  ],
};
