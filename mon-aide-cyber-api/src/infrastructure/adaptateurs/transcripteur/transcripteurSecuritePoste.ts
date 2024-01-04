import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSecuritePoste: Thematique = {
  description:
    "Prévenir les accès non autorisés, l'exécution de virus par des logiciels malveillants ou le contrôle à distance, particulièrement via Internet, est crucial. Les risques d'intrusion dans les systèmes informatiques sont significatifs, et les postes de travail représentent l'un des principaux vecteurs d'attaque potentiels.",
  libelle: 'Sécurité des postes',
  localisationIconeNavigation:
    '/images/diagnostic/securite-postes/icone-navigation.svg',
  localisationIllustration:
    '/images/diagnostic/securite-postes/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant:
            'securite-poste-maj-fonctionnelles-et-securite-deployees',
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
        },
      ],
    },
    {
      questions: [
        { identifiant: 'securite-poste-antivirus-deploye' },
        {
          identifiant: 'securite-poste-si-industriel-antivirus-deploye',
        },
      ],
    },
    {
      questions: [{ identifiant: 'securite-poste-pare-feu-local-active' }],
    },
    {
      questions: [
        {
          identifiant: 'securite-poste-outils-complementaires-securisation',
        },
        { identifiant: 'securite-poste-r-et-d-disques-chiffres' },
      ],
    },
  ],
};
