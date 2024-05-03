import { Thematique } from '../../../api/representateurs/types';

export const transcripteurReaction: Thematique = {
  description:
    "La première phase du traitement d'un incident consiste à le qualifier. Cela implique d'identifier les sources d'informations et les éventuelles anomalies qui sont associées. L'objectif principal est d'établir une vision aussi précise que possible de la situation en cours.",
  libelle: 'Réaction à une cyberattaque',

  styles: {
    navigation: 'navigation-reaction',
  },
  localisationIconeNavigation:
    '/images/diagnostic/reaction/icone-navigation.svg',
  localisationIllustration: '/images/diagnostic/reaction/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant:
            'reaction-surveillance-veille-vulnerabilites-potentielles',
          'info-bulles': [
            'reaction/veille-vulnerabilites-organisations-publiques.pug',
            'reaction/suivi-alertes-vulnerabilites.pug',
          ],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'reaction-sauvegardes-donnees-realisees',
          'info-bulles': ['reaction/jeu-sauvegarde-isole.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'reaction-dispositif-gestion-crise-adapte-defini',
          'info-bulles': ['reaction/organisation-gestion-crise.pug'],
        },
      ],
    },
  ],
};
