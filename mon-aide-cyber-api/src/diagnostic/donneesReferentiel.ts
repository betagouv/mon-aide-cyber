import { Referentiel } from "./Referentiel";

const referentiel: Referentiel = {
  contexte: {
    questions: [
      {
        identifiant: "nature-organisation",
        libelle: "Quelle est la nature de votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "nature-organisation-organisation-publique",
            libelle:
              "Organisation publique (ex. collectivité, administration centrale)",
            ordre: 0,
          },
          {
            identifiant: "nature-organisation-entreprise-privee",
            libelle: "Entreprise privée (ex. TPE, PME, ETI)",
            ordre: 1,
          },
          {
            identifiant: "nature-organisation-association",
            libelle: "Association (ex. association loi 1901)",
            ordre: 2,
          },
          {
            identifiant: "nature-organisation-autre",
            libelle: "Autre : préciser",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "secteur-activite",
        libelle: "Quel est son secteur d'activité ?",
        reponsesPossibles: [
          {
            identifiant: "secteur-activite-administration",
            libelle: "Administration",
            ordre: 0,
          },
          {
            identifiant: "secteur-activite-agriculture",
            libelle: "Agriculture",
            ordre: 1,
          },
          {
            identifiant: "secteur-activite-industrie",
            libelle: "Industrie",
            ordre: 2,
          },
          {
            identifiant: "secteur-activite-construction",
            libelle: "Construction",
            ordre: 3,
          },
          {
            identifiant: "secteur-activite-tertiaire",
            libelle: "Tertiaire",
            ordre: 4,
          },
          {
            identifiant: "secteur-activite-commerce",
            libelle: "Commerce",
            ordre: 5,
          },
          {
            identifiant: "secteur-activite-transports",
            libelle: "Transports",
            ordre: 6,
          },
          {
            identifiant: "secteur-activite-hebergement-et-restauration",
            libelle: "Hébergement et restauration",
            ordre: 7,
          },
          {
            identifiant: "secteur-activite-information-et-communication",
            libelle: "Information et communication",
            ordre: 8,
          },
          {
            identifiant: "secteur-activite-activites-financieres-et-assurance",
            libelle: "Activités financières et d'assurance",
            ordre: 9,
          },
          {
            identifiant: "secteur-activite-activites-immobilieres",
            libelle: "Activités immobilières",
            ordre: 10,
          },
          {
            identifiant:
              "secteur-activite-activites-specialisees-scientifiques-et-techniques",
            libelle: "Activités spécialisées, scientifiques et techniques",
            ordre: 11,
          },
          {
            identifiant:
              "secteur-activite-activites-de-services-administratifs-et-de-soutien",
            libelle: "Activités de services administratifs et de soutien",
            ordre: 12,
          },
          {
            identifiant: "secteur-activite-enseignement",
            libelle: "Enseignement",
            ordre: 13,
          },
          {
            identifiant: "secteur-activite-sante-humaine-et-action-sociale",
            libelle: "Santé humaine et action sociale",
            ordre: 14,
          },
          {
            identifiant:
              "secteur-activite-arts-spectacles-et-activites-recreatives",
            libelle: "Arts, spectacles et activités récréatives",
            ordre: 15,
          },
          {
            identifiant: "secteur-activite-autres-activites-de-services",
            libelle: "Autres activités de services",
            ordre: 16,
          },
          {
            identifiant: "secteur-activite-services-aux-menages",
            libelle: "Services aux ménages",
            ordre: 17,
          },
          {
            identifiant: "secteur-activite-activites-extra-territoriales",
            libelle: "Activités extra-territoriales",
            ordre: 18,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "nombre-personnes-dans-organisation",
        libelle: "Combien de personnes compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "nombre-personnes-dans-organisation-entre-0-et-20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant: "nombre-personnes-dans-organisation-entre-20-et-50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant: "nombre-personnes-dans-organisation-entre-50-et-100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant: "nombre-personnes-dans-organisation-entre-100-et-200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant: "nombre-personnes-dans-organisation-plus-de-200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant: "nombre-personnes-dans-organisation-plus-de-500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "nombre-postes-travail-dans-organisation",
        libelle: "Combien de postes de travail compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant:
              "nombre-postes-travail-dans-organisation-entre-0-et-20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant:
              "nombre-postes-travail-dans-organisation-entre-20-et-50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant:
              "nombre-postes-travail-dans-organisation-entre-50-et-100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant:
              "nombre-postes-travail-dans-organisation-entre-100-et-200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant: "nombre-postes-travail-dans-organisation-plus-de-200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant: "nombre-postes-travail-dans-organisation-plus-de-500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "activites-recherche-et-developpement",
        libelle:
          'Votre organisation a-t-elle des activités de "Recherche et Développement" ?',
        reponsesPossibles: [
          {
            identifiant: "activites-recherche-et-developpement-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          {
            identifiant: "activites-recherche-et-developpement-non",
            libelle: "Non",
            ordre: 2,
          },
          {
            identifiant: "activites-recherche-et-developpement-oui",
            libelle: "Oui",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "opere-systemes-information-industriels",
        libelle:
          "Votre organisation opère-t-elle des systèmes d'information industriels ?",
        reponsesPossibles: [
          {
            identifiant: "opere-systemes-information-industriels-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          {
            identifiant: "opere-systemes-information-industriels-non",
            libelle: "Non",
            ordre: 2,
          },
          {
            identifiant: "opere-systemes-information-industriels-oui",
            libelle: "Oui",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "usage-cloud",
        libelle: "Existe t-il un usage du Cloud dans votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "usage-cloud-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "usage-cloud-non", libelle: "Non", ordre: 2 },
          {
            identifiant: "usage-cloud-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "usage-cloud-oui-question-tiroir-usages",
                libelle: 'Si "Oui": quels sont vos usages du Cloud ?',
                reponsesPossibles: [
                  {
                    identifiant: "usage-cloud-oui-question-tiroir-usages-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "usage-cloud-oui-question-tiroir-usages-messagerie",
                    libelle: "Messagerie",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "usage-cloud-oui-question-tiroir-usages-suite-bureautique-complete",
                    libelle: "Suite bureautique complète",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "usage-cloud-oui-question-tiroir-usages-hebergement-donnees-et-sauvegardes",
                    libelle: "Hébergement des données et sauvegardes",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "usage-cloud-oui-question-tiroir-usages-virtualisation-complete-si",
                    libelle: "Virtualisation complète du SI",
                    ordre: 5,
                  },
                  {
                    identifiant: "usage-cloud-oui-question-tiroir-usages-autre",
                    libelle: "Autre : Préciser",
                    ordre: 6,
                  },
                ],
                type: "choixMultiple",
              },
            ],
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "cyber-attaque-subie",
        libelle: "Avez-vous déjà subi une cyberrataque ?",
        reponsesPossibles: [
          {
            identifiant: "cyber-attaque-subie-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "cyber-attaque-subie-non", libelle: "Non", ordre: 2 },
          {
            identifiant: "cyber-attaque-subie-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "cyber-attaque-subie-oui-tiroir-type",
                libelle: "Si oui, de quel type ?",
                reponsesPossibles: [
                  {
                    identifiant:
                      "cyber-attaque-subie-oui-tiroir-type-compromission",
                    libelle: "Compromission d'un poste et/ou d'une boîte mail",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "cyber-attaque-subie-oui-tiroir-type-rancongiciel",
                    libelle:
                      "Rançongiciel ou  autre maliciel sur plusieurs postes",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "cyber-attaque-subie-oui-tiroir-type-faux-ordre",
                    libelle: "Faux ordre de virement",
                    ordre: 2,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-tiroir-type-autre",
                    libelle: "Autre : Préciser",
                    ordre: 3,
                  },
                ],
                type: "choixMultiple",
              },
              {
                identifiant: "cyber-attaque-subie-tiroir-plainte",
                libelle:
                  'Si "Oui": avez-vous déposé plainte ou réalisé un signalement auprès d\'un service judiciaire ?',
                reponsesPossibles: [
                  {
                    identifiant: "cyber-attaque-subie-tiroir-plainte-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 0,
                  },
                  {
                    identifiant: "cyber-attaque-subie-tiroir-plainte-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant: "cyber-attaque-subie-tiroir-plainte-oui",
                    libelle: "Oui",
                    ordre: 2,
                  },
                ],
                type: "choixUnique",
              },
            ],
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  gouvernance: {
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
            ordre: 1,
          },
          {
            identifiant:
              "gouvernance-infos-et-processus-a-proteger-oui-idee-generale",
            libelle:
              "Nous avons une idée générale de nos données et processus à protéger en priorité.",
            ordre: 2,
          },
          {
            identifiant:
              "gouvernance-infos-et-processus-a-proteger-oui-precise",
            libelle:
              "Il existe une liste précise et maintenue à jour de toutes les données et processus à protéger en priorité à l’échelle de l’organisation.",
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
            identifiant: "gouvernance-schema-nsp",
            libelle: "Je ne sais pas.",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-schema-non-pas-a-jour",
            libelle:
              "Non / Nous avons un schéma historique qui n'est pas à jour",
            ordre: 1,
          },
          {
            identifiant: "gouvernance-schema-oui-macro",
            libelle:
              'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
            ordre: 2,
          },
          {
            identifiant: "gouvernance-schema-oui-detaille",
            libelle:
              "Il existe un schéma détaillé, incluant la liste exhaustive des interconnexions vers l'extérieur.",
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
            identifiant: "gouvernance-schema-si-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-schema-si-non",
            libelle: "Non.",
            ordre: 1,
          },
          {
            identifiant: "gouvernance-schema-si-oui-partiel",
            libelle:
              'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
            ordre: 2,
          },
          {
            identifiant: "gouvernance-schema-si-oui-detaille",
            libelle:
              "'Il existe un schéma détaillé, incluant la liste exhaustive des systèmes industrielles, installations matériels connectés et des interconnexions vers l'extérieur.",
            ordre: 3,
          },
        ],
      },
      {
        identifiant: "gouvernance-connaissance-rgpd",
        libelle:
          "Connaissez-vous les exigences réglementaires liées au RGPD concernant vos traitements des données personnelles, incluant vos données RH ou celles de vos clients/usagers ?",
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
            ordre: 2,
          },
          {
            identifiant: "gouvernance-connaissance-rgpd-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "gouvernance-connaissance-rgpd-oui-tiroir",
                libelle:
                  'Si "Oui" : combien de mesures de conformité respectez-vous parmi celles-ci ?',
                type: "choixMultiple",
                reponsesPossibles: [
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-non-applicable",
                    libelle: "Non applicable",
                    ordre: 0,
                  },

                  {
                    identifiant: "gouvernance-connaissance-rgpd-oui-tiroir-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement",
                    libelle: "Etablissement d'un registre de vos traitements",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-traitement-nature-besoin-suppression",
                    libelle:
                      "Pour chaque traitement, détermination de la nature, besoin et finalité des traitements de données personnelles effectuées puis suppression de données non nécessaires",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-analyse-impact",
                    libelle:
                      "Analyse d'impact relative à la protection des données sur les traitements susceptibles d'engendrer un risque élevé",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-info-donnees-finalite",
                    libelle:
                      "Information auprès des personnes concernées des données personnelles traitées et leurs finalités",
                    ordre: 5,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-moyen-exercer-valoir-droits",
                    libelle:
                      "Mise en place de moyens permettant aux personnes concernées d'exercer et faire valoir leurs droits (droits d’accès, rectification, opposition, suppression; etc.)",
                    ordre: 6,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        identifiant: "gouvernance-moyen-budgetaire-cyber-securite",
        libelle:
          "Des moyens budgétaires sont-ils alloués à la cybersécurité au sein de votre organisation ?",
        type: "choixUnique",
        reponsesPossibles: [
          {
            identifiant: "gouvernance-moyen-budgetaire-cyber-securite-nsp",
            libelle: "Je ne sais pas.",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-moyen-budgetaire-cyber-securite-non",
            libelle: "Non.",
            ordre: 1,
          },
          {
            identifiant:
              "gouvernance-moyen-budgetaire-cyber-securite-oui-ponctuels",
            libelle:
              "Des achats ponctuels ont été réalisés mais il n’existe pas de ligne budgétaire dédiée.",
            ordre: 2,
          },
          {
            identifiant:
              "gouvernance-moyen-budgetaire-cyber-securite-oui-dedie",
            libelle:
              "Il existe une ligne budgétaire dédiée à la cybersécurité dont le montant est >= 10% du buget IT ; ou déterminé via une analyse approfondie",
            ordre: 3,
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
            identifiant: "gouvernance-exigence-cyber-securite-presta-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-exigence-cyber-securite-presta-non",
            libelle:
              "Non, aucune exigence ne figure dans nos contrats de prestation",
            ordre: 1,
          },
          {
            identifiant:
              "gouvernance-exigence-cyber-securite-presta-oui-formalisee",
            libelle:
              "Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.",
            ordre: 2,
          },
          {
            identifiant: "gouvernance-exigence-cyber-securite-presta-oui-fixee",
            libelle:
              "Oui, des exigences de cybersécurité avec pénalités sont formalisées et fixées aux prestataires.",
            ordre: 3,
          },
        ],
      },
    ],
  },
};

export { referentiel };
