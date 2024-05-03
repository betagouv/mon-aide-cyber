import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSensibilisation: Thematique = {
  description:
    "Il est important d’éduquer tous les utilisateurs, qu'ils fassent partie de l'organisation ou non, qui manipulent des données personnelles, aux risques liés aux libertés et à la vie privée des individus. Il faut fournir des informations sur les actions entreprises pour gérer ces risques, ainsi que sur les conséquences possibles en cas de non-respect des directives.",
  libelle: 'Sensibilisation des utilisateurs',
  styles: {
    navigation: 'navigation-sensibilisation',
  },
  localisationIllustration:
    '/images/diagnostic/sensibilisation/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
          'info-bulles': ['sensibilisation/actions-sensibilisation.pug'],
        },
        {
          identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d',
          'info-bulles': [
            'sensibilisation/passeport-conseils-cyber-voyageurs.pug',
          ],
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
