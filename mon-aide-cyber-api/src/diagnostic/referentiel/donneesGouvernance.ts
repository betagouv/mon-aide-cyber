import { QuestionsThematique } from '../Referentiel';

export const donneesGouvernance: QuestionsThematique = {
  questions: [
    {
      identifiant: 'gouvernance-infos-et-activités-a-proteger',
      libelle:
        'Avez-vous déterminé les informations et les activités métiers à protéger en priorité ?',
      poids: 2,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-infos-et-activités-a-proteger-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-infos-et-activités-a-proteger-non',
          libelle: 'Non.',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activités-a-proteger',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-infos-et-activités-a-proteger-oui-idee-generale',
          libelle:
            'Nous avons une idée générale de nos données et activités métiers à protéger en priorité.',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activités-a-proteger',
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-infos-et-processus-a-proteger-oui-precise',
          libelle:
            'Il existe une liste précise et maintenue à jour de toutes les données et activités métiers à protéger en priorité à l’échelle de l’organisation.',
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-a-jour',
      libelle:
        'Existe-t-il un plan du système d’information de l’organisation ?',
      poids: 1,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 1 },
            mesures: [
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
            indice: { valeur: 3 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-industriel-a-jour',
      libelle:
        "Si l'entité dispose de systèmes industriels : Existe-t-il un plan et un inventaire des systèmes d'informations industriels de l'organisation ?",
      poids: 1,
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
            indice: { valeur: 0 },
            mesures: [
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
            'Il existe un plan "macro" non détaillé ou partiellement détaillé à jour.',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
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
            "Il existe un schéma détaillé à jour, incluant la liste exhaustive des systèmes industrielles, installations matériels connectés et des interconnexions vers l'extérieur.",
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: 'gouvernance-connaissance-rgpd-1',
      libelle:
        'Avez-vous listé les données personnelles traitées au sein de votre entité ?',
      type: 'choixUnique',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-connaissance-rgpd-1-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-1-non',
          libelle: 'Non.',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-connaissance-rgpd-1',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-1-oui-liste-données',
          libelle:
            "Oui, j'ai listé l'ensemble des données personnelles traitées au sein de mon entité",
          ordre: 3,
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              { identifiant: 'gouvernance-connaissance-rgpd-1', niveau: 2 },
            ],
          },
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-1-oui-registre',
          libelle: 'Oui, je tiens à jour un registre des traitements',
          ordre: 4,
          resultat: {
            indice: { valeur: 3 },
          },
        },
      ],
    },
    {
      identifiant: 'gouvernance-connaissance-rgpd-2',
      libelle:
        "Informez-vous les personnes concernées sur l'utilisation de leurs données personnelles et leurs droits ? ",
      type: 'choixUnique',
      poids: 1,
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-connaissance-rgpd-2-nsp',
          libelle: 'Je ne sais pas.',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-2-non',
          libelle: 'Non.',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-connaissance-rgpd-2',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-2-oui-liste-données',
          libelle:
            "Oui, j'informe les personnes concernées sur l’utilisation de leurs données personnelles.",
          ordre: 3,
          resultat: {
            indice: { valeur: 2 },
            mesures: [
              { identifiant: 'gouvernance-connaissance-rgpd-2', niveau: 2 },
            ],
          },
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-2-oui-registre',
          libelle:
            'Oui, j’informe les personnes concernées et j’ai mis en place les moyens nécessaires leur permettant d’exercer leurs droits (ex : accès, rectification, opposition, suppression)',
          ordre: 4,
          resultat: {
            indice: { valeur: 3 },
          },
        },
      ],
    },
    {
      identifiant: 'gouvernance-exigence-cyber-securite-presta',
      libelle:
        "Des exigences de cybersécurité sont-elles intégrées aux contrats des prestataires disposant d'accès informatiques ?",
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: 'gouvernance-exigence-cyber-securite-presta-si-industriel',
      libelle:
        "Si l'entité dispose de systèmes industriels : des exigences de cybersécurité sont-elles intégrées dans les contrats des prestataires disposant d'accès informatiques sur les systèmes industriels ?",
      poids: 2,
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
            indice: { valeur: 0 },
            mesures: [
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
            indice: { valeur: 2 },
            mesures: [
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
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
    },
  ],
};
