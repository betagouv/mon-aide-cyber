import { QuestionsThematique } from '../Referentiel';

export const donneesSensibilisation: QuestionsThematique = {
  questions: [
    {
      identifiant:
        'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
      libelle:
        'Des actions de sensibilisation à la menace et aux bonnes pratiques cyber sont-elles réalisées plusieurs fois par an ?',
      poids: 3,
      reponsesPossibles: [
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-ponctuellement',
          libelle:
            'Oui, nous menons ponctuellement des actions de sensibilisation.',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-regulierement',
          libelle:
            'Oui, nous menons régulièrement des actions de sensibilisation ciblant des populations spécifiques.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d',
      libelle:
        "Si entité avec risque d'espionnage industriel (R&D), menez-vous des actions de sensibilisation ciblant spécifiquement les collaborateurs effectuant des missions à l'étranger ?",
      poids: 2,
      reponsesPossibles: [
        {
          identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d-na',
          libelle: 'Non applicable.',
          ordre: 0,
        },
        {
          identifiant:
            'sensibilisation-risque-espionnage-industriel-r-et-d-nsp',
          libelle: 'Je ne sais pas.',
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
      identifiant:
        'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
      libelle:
        'Le respect d’une charte d’utilisation des moyens informatiques et des outils numériques est-il exigé au personnel ?',
      poids: 2,
      reponsesPossibles: [
        {
          identifiant:
            'sensibilisation-collaborateurs-soumis-obligations-usages-securises-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant:
            'sensibilisation-collaborateurs-soumis-obligations-usages-securises-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-communiquee',
          libelle: 'Oui, une charte est communiquée aux collaborateurs.',
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              {
                identifiant:
                  'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-signee',
          libelle:
            'Oui, une charte est signée par chaque collaborateur et elle est annexée au règlement intérieur.',
          resultat: { indice: { valeur: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
