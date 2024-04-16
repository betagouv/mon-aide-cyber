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
          'info-bulles': [
            'postes/maj-fonctionnelles-installees.pug',
            'postes/mesures-complementaires.pug',
            'postes/deploiement-et-controles-maj.pug',
          ],
        },
        {
          identifiant:
            'securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-poste-antivirus-deploye',
          'info-bulles': [
            'postes/maj-antivirus-installees.pug',
            'postes/windows-defender.pug',
          ],
        },
        {
          identifiant: 'securite-poste-si-industriel-antivirus-deploye',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-poste-pare-feu-local-active',
          'info-bulles': ['postes/pare-feu-local.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-poste-outils-complementaires-securisation',
          'info-bulles': ['postes/edr-installe.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-poste-r-et-d-disques-chiffres',
          'info-bulles': [
            'postes/windows-bitlocker-installe.pug',
            'postes/materiels-nomades.pug',
          ],
        },
      ],
    },
  ],
};
