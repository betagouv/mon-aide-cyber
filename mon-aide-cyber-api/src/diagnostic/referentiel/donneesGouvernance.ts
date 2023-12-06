import { QuestionsThematique } from '../Referentiel';

export const donneesGouvernance: QuestionsThematique = {
  questions: [
    {
      identifiant: 'gouvernance-infos-et-processus-a-proteger',
      libelle:
        'Avez-vous déterminé les informations et les activités à protéger en priorité ?',
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-infos-et-processus-a-proteger-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-infos-et-processus-a-proteger-non',
          libelle: 'Non.',
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: 'gouvernance-infos-et-processus-a-proteger',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-infos-et-processus-a-proteger-oui-idee-generale',
          libelle:
            'Nous avons une idée générale de nos données et processus à protéger en priorité.',
          resultat: {
            note: 1.5,
            recommandations: [
              {
                identifiant: 'gouvernance-infos-et-processus-a-proteger',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-infos-et-processus-a-proteger-oui-precise',
          libelle:
            'Il existe une liste précise et maintenue à jour de toutes les données et processus à protéger en priorité à l’échelle de l’organisation.',
          resultat: {
            note: 3,
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-a-jour',
      libelle:
        'Existe-t-il un plan du système d’information de l’organisation ?',
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-a-jour-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-non',
          libelle: "Non / Nous avons un plan historique qui n'est pas à jour",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: 'gouvernance-schema-si-a-jour',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-oui-macro',
          libelle:
            'Il existe un plan "macro" non détaillé ou partiellement détaillé à jour.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: 'gouvernance-schema-si-a-jour',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-oui-detaille',
          libelle:
            "Il existe un schéma détaillé à jour, incluant la liste exhaustive des interconnexions vers l'extérieur.",
          resultat: {
            note: 3,
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-industriel-a-jour',
      libelle:
        "Si l'entité dispose de systèmes industriels : Existe-t-il un plan et un inventaire des systèmes d'informations industriels de l'organisation ?",
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-non',
          libelle: 'Non.',
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-oui-partiel',
          libelle:
            'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-oui-detaille',
          libelle:
            "'Il existe un schéma détaillé, incluant la liste exhaustive des systèmes industrielles, installations matériels connectés et des interconnexions vers l'extérieur.",
          resultat: {
            note: 3,
          },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: 'gouvernance-connaissance-rgpd',
      libelle:
        'Avez-vous mené une démarche de conformité liée au RGPD concernant vos traitements des données personnelles ?',
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-connaissance-rgpd-na',
          libelle: 'Non applicable.',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-non',
          libelle: 'Non.',
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: 'gouvernance-connaissance-rgpd',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-oui-registre-traitement',
          libelle: 'Oui, je tiens à jour mon registre des traitements.',
          ordre: 3,
          resultat: {
            note: 2,
            recommandations: [
              { identifiant: 'gouvernance-connaissance-rgpd', niveau: 2 },
            ],
          },
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-oui',
          libelle:
            "Oui, je tiens à jour mon registre des traitements et j'informe les personnes concernées sur leurs droits et l'utilisation de leurs données.",
          ordre: 3,
          resultat: {
            note: 3,
          },
        },
      ],
    },
    {
      identifiant: 'gouvernance-exigence-cyber-securite-presta',
      libelle:
        "Des exigences de cybersécurité sont-elles intégrées aux contrats des prestataires disposant d'accès informatiques ?",
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-non',
          libelle:
            'Non, aucune exigence ne figure dans nos contrats de prestation',
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: 'gouvernance-exigence-cyber-securite-presta',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-oui-formalisee',
          libelle:
            'Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: 'gouvernance-exigence-cyber-securite-presta',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant: 'gouvernance-exigence-cyber-securite-presta-oui-fixee',
          libelle:
            'Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires.',
          resultat: { note: 3 },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: 'gouvernance-exigence-cyber-securite-presta-si-industriel',
      libelle:
        "Si l'entité dispose de systèmes industriels : des exigences de cybersécurité sont-elles intégrées dans les contrats des prestataires disposant d'accès informatiques sur les systèmes industriels ?",
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel-non',
          libelle:
            'Non, aucune exigence ne figure dans nos contrats de prestation',
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant:
                  'gouvernance-exigence-cyber-securite-presta-si-industriel',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel-oui-formalisee',
          libelle:
            'Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant:
                  'gouvernance-exigence-cyber-securite-presta-si-industriel',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'gouvernance-exigence-cyber-securite-presta-si-industriel-oui-fixee',
          libelle:
            'Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires.',
          resultat: { note: 3 },
          ordre: 4,
        },
      ],
    },
  ],
};
