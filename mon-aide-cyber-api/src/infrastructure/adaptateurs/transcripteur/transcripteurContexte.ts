import { Thematique } from '../../../api/representateurs/types';

export const transcripteurContexte: Thematique = {
  description:
    "Les informations contextuelles d'une entreprise aident à situer sa position par rapport à d'autres dans le même secteur, à cerner les défis cyber propres à son domaine d'activité et en fonction du nombre d'employés.",
  libelle: 'Contexte',
  styles: {
    navigation: 'navigation-contexte',
  },
  localisationIllustration: '/images/diagnostic/contexte/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant: 'contexte-cgu-signees',
          'info-bulles': ['contexte/cgu-signees.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-nature-organisation',
          'info-bulles': ['contexte/nature-entite.pug'],
        },
        {
          identifiant: 'contexte-nature-entite',
          'info-bulles': ['contexte/nature-entite.pug'],
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
          type: {
            champsAAfficher: ['ordre', 'libelle'],
            clefsFiltrage: ['ordre', 'libelle'],
          },
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-nombre-personnes-dans-organisation',
        },
        {
          identifiant: 'contexte-nombre-personnes-dans-entite',
        },
        {
          identifiant: 'contexte-nombre-postes-travail-dans-organisation',
          'info-bulles': ['contexte/nombre-de-postes.pug'],
        },
        {
          identifiant: 'contexte-nombre-postes-travail-dans-entite',
          'info-bulles': ['contexte/nombre-de-postes.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-activites-recherche-et-developpement',
          'info-bulles': ['contexte/attaque-ciblee.pug'],
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
