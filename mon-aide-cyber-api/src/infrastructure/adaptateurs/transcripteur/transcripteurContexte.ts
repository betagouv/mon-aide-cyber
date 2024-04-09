import { Thematique } from '../../../api/representateurs/types';

export const transcripteurContexte: Thematique = {
  description:
    "Les informations contextuelles d'une entreprise aident à situer sa position par rapport à d'autres dans le même secteur, à cerner les défis cyber propres à son domaine d'activité et en fonction du nombre d'employés.",
  libelle: 'Contexte',
  localisationIconeNavigation:
    '/images/diagnostic/contexte/icone-navigation.svg',
  localisationIllustration: '/images/diagnostic/contexte/illustration.svg',
  groupes: [
    {
      questions: [{ identifiant: 'contexte-cgu-signees' }],
    },
    {
      questions: [
        { identifiant: 'contexte-nature-organisation' },
        {
          identifiant: 'contexte-secteur-activite',
          type: 'liste',
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
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-activites-recherche-et-developpement',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'contexte-opere-systemes-information-industriels',
        },
      ],
    },
    {
      questions: [{ identifiant: 'contexte-cyber-attaque-subie' }],
    },
    {
      questions: [{ identifiant: 'contexte-usage-cloud' }],
    },
  ],
};
