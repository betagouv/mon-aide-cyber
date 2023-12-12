import { QuestionsThematique } from '../Referentiel';

export const donneesSensibilisation: QuestionsThematique = {
  questions: [
    {
      identifiant:
        'sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques',
      libelle:
        'Des actions de sensibilisation à la menace et aux bonnes pratiques cyber sont-elles réalisées plusieurs fois par an ?',
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
            indice: { valeur: 0, poids: 3 },
            recommandations: [
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
            indice: { valeur: 1.5, poids: 3 },
            recommandations: [
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
          resultat: { indice: { valeur: 3, poids: 3 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'sensibilisation-risque-espionnage-industriel-r-et-d',
      libelle:
        "Si entité avec risque d'espionnage industriel (R&D), menez-vous des actions de sensibilisation ciblant spécifiquement les collaborateurs effectuant des missions à l'étranger ?",
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
            indice: { valeur: 0, poids: 2 },
            recommandations: [
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
          resultat: { indice: { valeur: 3, poids: 2 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant:
        'sensibilisation-collaborateurs-soumis-obligations-usages-securises',
      libelle:
        "Les collaborateurs sont-ils soumis à des obligations en matière d'usages sécurisés des moyens informatiques ?",
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
            indice: { valeur: 0, poids: 2 },
            recommandations: [
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
            indice: { valeur: 2, poids: 2 },
            recommandations: [
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
          resultat: { indice: { valeur: 3, poids: 2 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'sensibilisation-declaration-incidents-encouragee',
      libelle:
        "La déclaration d'incidents de sécurité par les salariés est-elle encouragée et facilitée ?",
      reponsesPossibles: [
        {
          identifiant: 'sensibilisation-declaration-incidents-encouragee-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'sensibilisation-declaration-incidents-encouragee-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0, poids: 1.5 },
            recommandations: [
              {
                identifiant: 'sensibilisation-declaration-incidents-encouragee',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'sensibilisation-declaration-incidents-encouragee-non-habitude-utilisateurs-contactent-informaticien',
          libelle:
            "Non, mais dans la majorité des cas, les utilisateurs ont pris l'habitude de contacter un informaticien en cas de doute ou d'incident.",
          resultat: {
            indice: { valeur: 1, poids: 1.5 },
            recommandations: [
              {
                identifiant: 'sensibilisation-declaration-incidents-encouragee',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'sensibilisation-declaration-incidents-encouragee-oui',
          libelle: 'Oui',
          resultat: { indice: { valeur: 3, poids: 1.5 } },
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
  ],
};
