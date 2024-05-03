import { Thematique } from '../../../api/representateurs/types';

export const transcripteurContexte: Thematique = {
  description:
    "Les informations contextuelles d'une entreprise aident à situer sa position par rapport à d'autres dans le même secteur, à cerner les défis cyber propres à son domaine d'activité et en fonction du nombre d'employés.",
  libelle: 'Contexte',
  styles: {
    navigation: 'navigation-contexte',
  },
  localisationIconeNavigation:
    '/images/diagnostic/contexte/icone-navigation.svg',
  localisationIllustration: '/images/diagnostic/contexte/illustration.svg',
  groupes: [
    {
      questions: [{ identifiant: 'contexte-cgu-signees' }],
    },
    {
      questions: [
        {
          identifiant: 'contexte-nature-organisation',
          'info-bulles': ['contexte/nature-organisation.pug'],
        },
        {
          identifiant: 'contexte-secteur-activite',
          type: 'liste',
          'info-bulles': ['contexte/secteur-activite.pug'],
        },
        {
          identifiant: 'contexte-region-siege-social',
          type: 'liste',
        },
        {
          identifiant: 'contexte-departement-tom-siege-social',
          type: 'liste',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-nombre-personnes-dans-organisation',
        },
        {
          identifiant: 'contexte-nombre-postes-travail-dans-organisation',
          'info-bulles': ['contexte/nombre-de-postes.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-activites-recherche-et-developpement',
          'info-bulles': ['contexte/espionnage-cible.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-opere-systemes-information-industriels',
          'info-bulles': ['contexte/systemes-industriels.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-cyber-attaque-subie',
          'info-bulles': ['contexte/cyberattaque.pug'],
        },
      ],
    },
    {
      questions: [{ identifiant: 'contexte-usage-cloud' }],
    },
  ],
};
