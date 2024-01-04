import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSensibilisation: Thematique = {
  description:
    "Il est important d’éduquer tous les utilisateurs, qu'ils fassent partie de l'organisation ou non, qui manipulent des données personnelles, aux risques liés aux libertés et à la vie privée des individus. Il faut fournir des informations sur les actions entreprises pour gérer ces risques, ainsi que sur les conséquences possibles en cas de non-respect des directives.",
  libelle: 'Sensibilisation des utilisateurs',
  localisationIconeNavigation:
    '/images/diagnostic/sensibilisation/icone-navigation.svg',
  localisationIllustration:
    '/images/diagnostic/sensibilisation/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
        },
        {
          identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'sensibilisation-declaration-incidents-encouragee',
        },
      ],
    },
  ],
};
