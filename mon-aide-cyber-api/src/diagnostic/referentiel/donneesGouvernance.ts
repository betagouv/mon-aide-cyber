import { QuestionsThematique } from '../Referentiel';

export const donneesGouvernance: QuestionsThematique = {
  questions: [
    {
      identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
      libelle:
        "Avez-vous identifié les activités à protéger en priorité et les systèmes d'information associés ?",
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-infos-et-activites-a-proteger-recyf-oui-idee-generale',
          libelle:
            'Une liste des activités à protéger en priorité de mon entité est formalisée',
          resultat: {
            indice: { valeur: 1.5 },
            mesures: [
              {
                identifiant: 'gouvernance-infos-et-activites-a-proteger-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-infos-et-activites-a-proteger-recyf-oui-precise',
          libelle:
            "Une liste des activités à protéger en priorité de mon entité et des systèmes d'information sur lesquels elles reposent est formalisée.",
          resultat: {
            indice: { valeur: 3 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-a-jour-recyf',
      libelle: 'Existe-t-il un plan du système d’information de l’entité ?',
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            'gouvernance-schema-si-a-jour-recyf-inventaire-formalise',
          libelle:
            'Un inventaire des systèmes exposés / interconnectés (services exposés sur internet, adresses publiques, accès distants, interconnexions partenaires) est formalisé.',
          resultat: {
            indice: { valeur: 0.5 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: 'gouvernance-schema-si-a-jour-recyf-schema-complet',
          libelle:
            "Un schéma complet est formalisée, permettant d'assurer le maintien en condition opérationnelle et de sécurité des systèmes et de réagir sans retard injustifié à un incident de sécurité (ex. version des différents logiciels et OS des équipements, équipements réseaux, interconnexions avec l'extérieur, etc.)",
          resultat: {
            indice: { valeur: 1 },
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
      libelle:
        "Existe-t-il un plan et un inventaire des systèmes d'informations industriels de l'entité ?",
      poids: 1,
      type: 'choixUnique',
      reponsesPossibles: [
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-na',
          libelle: 'Non applicable',
          ordre: 0,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf-non',
          libelle: 'Non',
          resultat: {
            indice: { valeur: 0 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            'gouvernance-schema-si-industriel-a-jour-recyf-oui-partiel',
          libelle:
            'Il existe un plan "macro" non détaillé ou partiellement détaillé à jour',
          resultat: {
            indice: { valeur: 1 },
            mesures: [
              {
                identifiant: 'gouvernance-schema-si-industriel-a-jour-recyf',
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            'gouvernance-schema-si-industriel-a-jour-recyf-oui-detaille',
          libelle:
            'Il existe un plan détaillé, incluant la liste détaillée des composants du système d’information et la liste exhaustive des interconnexions vers l’extérieur',
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
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-1-non',
          libelle: 'Non',
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
            "Oui, nous avons listé l'ensemble des données personnelles traitées au sein de mon entité",
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
          libelle: 'Oui, nous tenons à jour un registre des traitements',
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
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'gouvernance-connaissance-rgpd-2-non',
          libelle: 'Non',
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
            "Oui, j'informe les personnes concernées sur l’utilisation de leurs données personnelles",
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
            'Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires',
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
            'Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires',
          resultat: { indice: { valeur: 3 } },
          ordre: 4,
        },
      ],
    },
  ],
};
