import { QuestionsThematique } from "../Referentiel";

export const donneesGouvernance: QuestionsThematique = {
  questions: [
    {
      identifiant: "gouvernance-infos-et-processus-a-proteger",
      libelle:
        "Disposez-vous d'une liste à jour des informations et processus à protéger en priorité dans votre organisation ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant: "gouvernance-infos-et-processus-a-proteger-nsp",
          libelle: "Je ne sais pas.",
          ordre: 0,
        },
        {
          identifiant: "gouvernance-infos-et-processus-a-proteger-non",
          libelle: "Non.",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: "gouvernance-infos-et-processus-a-proteger",
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant:
            "gouvernance-infos-et-processus-a-proteger-oui-idee-generale",
          libelle:
            "Nous avons une idée générale de nos données et processus à protéger en priorité.",
          resultat: {
            note: 1.5,
            recommandations: [
              {
                identifiant: "gouvernance-infos-et-processus-a-proteger",
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: "gouvernance-infos-et-processus-a-proteger-oui-precise",
          libelle:
            "Il existe une liste précise et maintenue à jour de toutes les données et processus à protéger en priorité à l’échelle de l’organisation.",
          resultat: {
            note: 3,
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: "gouvernance-schema-si-a-jour",
      libelle:
        "Existe-t-il un schéma à jour du système d’information de l’organisation ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant: "gouvernance-schema-si-a-jour-nsp",
          libelle: "Je ne sais pas.",
          ordre: 0,
        },
        {
          identifiant: "gouvernance-schema-si-a-jour-non",
          libelle: "Non / Nous avons un schéma historique qui n'est pas à jour",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: "gouvernance-schema-si-a-jour",
                niveau: 1,
              },
            ],
          },
          ordre: 1,
        },
        {
          identifiant: "gouvernance-schema-si-a-jour-oui-macro",
          libelle:
            'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: "gouvernance-schema-si-a-jour",
                niveau: 2,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: "gouvernance-schema-si-a-jour-oui-detaille",
          libelle:
            "Il existe un schéma détaillé, incluant la liste exhaustive des interconnexions vers l'extérieur.",
          resultat: {
            note: 3,
          },
          ordre: 3,
        },
      ],
    },
    {
      identifiant: "gouvernance-schema-si-industriel-a-jour",
      libelle:
        "Si l'entité dispose d'un SI industriel : Existe-t-il un schéma et un inventaire à jour du système d'information industriel de l'organisation ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant: "gouvernance-schema-si-industriel-a-jour-na",
          libelle: "Non applicable",
          ordre: 0,
        },
        {
          identifiant: "gouvernance-schema-si-industriel-a-jour-nsp",
          libelle: "Je ne sais pas",
          ordre: 1,
        },
        {
          identifiant: "gouvernance-schema-si-industriel-a-jour-non",
          libelle: "Non.",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: "gouvernance-schema-si-industriel-a-jour",
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: "gouvernance-schema-si-industriel-a-jour-oui-partiel",
          libelle:
            'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: "gouvernance-schema-si-industriel-a-jour",
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant: "gouvernance-schema-si-industriel-a-jour-oui-detaille",
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
      identifiant: "gouvernance-connaissance-rgpd",
      libelle:
        "Avez-vous mener une démarche de conformité liées au RGPD concernant vos traitements des données personnelles, incluant vos données RH ou celles de vos clients/usagers ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant: "gouvernance-connaissance-rgpd-nsp",
          libelle: "Je ne sais pas.",
          ordre: 1,
        },
        {
          identifiant: "gouvernance-connaissance-rgpd-non",
          libelle: "Non.",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: "gouvernance-connaissance-rgpd",
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant: "gouvernance-connaissance-rgpd-oui",
          libelle: "Oui",
          ordre: 3,
          questions: [
            {
              identifiant:
                "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement",
              libelle:
                'Si "Oui" : avez-vous établi de manière exhaustive le registre de vos traitements ?',
              type: "choixUnique",
              reponsesPossibles: [
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },

                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-non",
                  libelle: "Non",
                  resultat: {
                    note: 0,
                    recommandations: [
                      {
                        identifiant:
                          "gouvernance-connaissance-rgpd-registre-traitement",
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-oui",
                  libelle: "Oui",
                  resultat: {
                    note: 3,
                  },
                  ordre: 3,
                },
              ],
            },
            {
              identifiant:
                "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place",
              libelle:
                'Si "Oui" : avez-vous mis en place des moyens pour informer les personnes concernées par le traitement de leurs données personnelles et pour leur permettre d\'exercer et faire valoir leurs droits (droits d’accès, rectification, opposition, suppression; etc.) ?',
              type: "choixUnique",
              reponsesPossibles: [
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-na",
                  libelle: "Non applicable",
                  ordre: 0,
                },
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-nsp",
                  libelle: "Je ne sais pas",
                  ordre: 1,
                },
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-non",
                  libelle: "Non",
                  resultat: {
                    note: 0,
                    recommandations: [
                      {
                        identifiant:
                          "gouvernance-connaissance-rgpd-moyens-informer-personnes-mis-en-place",
                        niveau: 1,
                      },
                    ],
                  },
                  ordre: 2,
                },
                {
                  identifiant:
                    "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-oui",
                  libelle: "Oui",
                  resultat: { note: 3 },
                  ordre: 3,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      identifiant: "gouvernance-exigence-cyber-securite-presta",
      libelle:
        "Des exigences de cybersécurité sont-elles fixées aux prestataires ayant des accès informatiques ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant: "gouvernance-exigence-cyber-securite-presta-na",
          libelle: "Non applicable",
          ordre: 0,
        },
        {
          identifiant: "gouvernance-exigence-cyber-securite-presta-nsp",
          libelle: "Je ne sais pas",
          ordre: 1,
        },
        {
          identifiant: "gouvernance-exigence-cyber-securite-presta-non",
          libelle:
            "Non, aucune exigence ne figure dans nos contrats de prestation",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant: "gouvernance-exigence-cyber-securite-presta",
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-oui-formalisee",
          libelle:
            "Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.",
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant: "gouvernance-exigence-cyber-securite-presta",
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant: "gouvernance-exigence-cyber-securite-presta-oui-fixee",
          libelle:
            "Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires.",
          resultat: { note: 3 },
          ordre: 4,
        },
      ],
    },
    {
      identifiant: "gouvernance-exigence-cyber-securite-presta-si-industriel",
      libelle:
        "Si l'entité dispose d'un SI industriel : Des exigences de cybersécurité sont-elles fixées aux prestataires vous accompagnant dans la gestion du système industriel. Font-elles également  l'objet d'une attention particulière ?",
      type: "choixUnique",
      reponsesPossibles: [
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-si-industriel-na",
          libelle: "Non applicable",
          ordre: 0,
        },
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-si-industriel-nsp",
          libelle: "Je ne sais pas",
          ordre: 1,
        },
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-si-industriel-non",
          libelle:
            "Non, aucune exigence ne figure dans nos contrats de prestation",
          resultat: {
            note: 0,
            recommandations: [
              {
                identifiant:
                  "gouvernance-exigence-cyber-securite-presta-si-industriel",
                niveau: 1,
              },
            ],
          },
          ordre: 2,
        },
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-formalisee",
          libelle:
            "Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.",
          resultat: {
            note: 2,
            recommandations: [
              {
                identifiant:
                  "gouvernance-exigence-cyber-securite-presta-si-industriel",
                niveau: 2,
              },
            ],
          },
          ordre: 3,
        },
        {
          identifiant:
            "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-fixee",
          libelle:
            "Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires.",
          resultat: { note: 3 },
          ordre: 4,
        },
      ],
    },
  ],
};
