import { QuestionsThematique } from '../Referentiel';

export const donneesSensibilisation: QuestionsThematique = {
  questions: [
    {
      identifiant:
        'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf',
      libelle:
        'Des actions de sensibilisation à la menace et aux bonnes pratiques cyber sont-elles réalisées ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf-oui-ponctuellement',
          libelle:
            'Tous les collaborateurs ont été ou sont sensibilisé au moins une fois.',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-recyf-oui-regulierement',
          libelle:
            'Des actions de sensibilisation sont menées régulièrement, sous plusieurs formats répartis dans l’année (messages, exercices, faux phishing), intégrées au parcours d’arrivée et adaptées aux populations sensibles (finance, direction…).',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d',
      libelle:
        "Menez-vous des actions de sensibilisation ciblant spécifiquement les collaborateurs effectuant des missions à l'étranger ?",
      poids: 2,
      reponsesPossibles: [
        {
          identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'sensibilisation-risque-espionnage-industriel-r-et-d-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-risque-espionnage-industriel-r-et-d-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-risque-espionnage-industriel-r-et-d',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'sensibilisation-risque-espionnage-industriel-r-et-d-oui',
          libelle: 'Oui',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'sensibilisation-personnel-utilisation-charte-recyf',
      libelle:
        'Le respect d’une charte d’utilisation des systèmes d’information est-il exigé au personnel ?',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'sensibilisation-personnel-utilisation-charte-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'sensibilisation-personnel-utilisation-charte-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-personnel-utilisation-charte-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-personnel-utilisation-charte-recyf-oui-charte-communiquee',
          libelle:
            'Une charte d’utilisation des systèmes d’information est rédigée et communiquée aux collaborateurs.',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-personnel-utilisation-charte-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'sensibilisation-personnel-utilisation-charte-recyf-oui-charte-signee',
          libelle:
            'Une charte opposable (signée par chaque utilisateur, annexée au contrat de travail ou au règlement intérieur), prévoyant des dispositions spécifiques pour les administrateurs, est intégrée au parcours d’arrivée et revue au moins une fois par an.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
