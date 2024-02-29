import { Thematique } from '../../../api/representateurs/types';

export const transcripteurGouvernance: Thematique = {
  description:
    "La gouvernance des systèmes d’information implique initialement l'établissement d'objectifs pour ces systèmes, alignés sur la stratégie de l'entreprise. Cette approche vise à déterminer comment le système d'information participe à la création de valeur pour l'entreprise et précise le rôle des différents acteurs.",
  libelle: 'Gouvernance',
  localisationIconeNavigation:
    '/images/diagnostic/gouvernance/icone-navigation.svg',
  localisationIllustration: '/images/diagnostic/gouvernance/illustration.svg',
  groupes: [
    {
      questions: [{ identifiant: 'gouvernance-infos-et-processus-a-proteger' }],
    },
    {
      questions: [{ identifiant: 'gouvernance-infos-et-activites-a-proteger' }],
    },
    {
      questions: [
        { identifiant: 'gouvernance-schema-si-a-jour' },
        { identifiant: 'gouvernance-schema-si-industriel-a-jour' },
      ],
    },
    {
      questions: [{ identifiant: 'gouvernance-connaissance-rgpd' }],
    },
    {
      questions: [{ identifiant: 'gouvernance-connaissance-rgpd-1' }],
    },
    {
      questions: [{ identifiant: 'gouvernance-connaissance-rgpd-2' }],
    },
    {
      questions: [
        { identifiant: 'gouvernance-exigence-cyber-securite-presta' },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel',
        },
      ],
    },
  ],
};
