import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSecuriteAcces: Thematique = {
  description:
    "La sécurité de l'information englobe la protection des données et des renseignements contre tout accès, usage, divulgation, altération, perturbation ou destruction non autorisés. Elle représente une préoccupation essentielle tant pour les individus que pour les organisations.",
  libelle: "Sécurité des accès au système d'information",
  localisationIconeNavigation:
    '/images/diagnostic/securite-acces/icone-navigation.svg',
  localisationIllustration:
    '/images/diagnostic/securite-acces/illustration.svg',
  groupes: [
    {
      questions: [{ identifiant: 'acces-outil-gestion-des-comptes' }],
    },
    {
      questions: [{ identifiant: 'acces-liste-compte-utilisateurs' }],
    },
    {
      questions: [{ identifiant: 'acces-droits-acces-utilisateurs-limites' }],
    },
    {
      questions: [{ identifiant: 'acces-utilisateurs-administrateurs-poste' }],
    },
    {
      questions: [{ identifiant: 'acces-mesures-securite-robustesse-mdp' }],
    },
    {
      questions: [
        {
          identifiant: 'acces-administrateurs-informatiques-suivie-et-limitee',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'acces-utilisation-comptes-administrateurs-droits-limitee',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-administrateurs-si-mesures-specifiques',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'acces-teletravail-acces-distants-mesures-particulieres',
        },
        {
          identifiant:
            'acces-si-industriel-teletravail-acces-distants-mesures-particulieres',
        },
      ],
    },
  ],
};
