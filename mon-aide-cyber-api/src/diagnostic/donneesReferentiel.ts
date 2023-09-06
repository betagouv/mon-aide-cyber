import { Referentiel } from "./Referentiel";

const referentiel: Referentiel = {
  contexte: {
    questions: [
      {
        identifiant: "natureOrganisation",
        libelle: "Quelle est la nature de votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "organisationPublique",
            libelle:
              "Organisation publique (ex. collectivité, administration centrale)",
            ordre: 0,
          },
          {
            identifiant: "entreprisePrivee",
            libelle: "Entreprise privée (ex. TPE, PME, ETI)",
            ordre: 1,
          },
          {
            identifiant: "association",
            libelle: "Association (ex. association loi 1901)",
            ordre: 2,
          },
          { identifiant: "autre", libelle: "Autre : préciser", ordre: 3 },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "secteurActivite",
        libelle: "Quel est son secteur d'activité ?",
        reponsesPossibles: [
          {
            identifiant: "administration",
            libelle: "Administration",
            ordre: 0,
          },
          { identifiant: "agriculture", libelle: "Agriculture", ordre: 1 },
          { identifiant: "industrie", libelle: "Industrie", ordre: 2 },
          { identifiant: "construction", libelle: "Construction", ordre: 3 },
          { identifiant: "tertiaire", libelle: "Tertiaire", ordre: 4 },
          { identifiant: "commerce", libelle: "Commerce", ordre: 5 },
          { identifiant: "transports", libelle: "Transports", ordre: 6 },
          {
            identifiant: "hebergementEtRestauration",
            libelle: "Hébergement et restauration",
            ordre: 7,
          },
          {
            identifiant: "informationEtcommunication",
            libelle: "Information et communication",
            ordre: 8,
          },
          {
            identifiant: "activitesFinancieresEtAssurance",
            libelle: "Activités financières et d'assurance",
            ordre: 9,
          },
          {
            identifiant: "activitesImmobilieres",
            libelle: "Activités immobilières",
            ordre: 10,
          },
          {
            identifiant: "activitesSpecialiseesScientifiquesEtTechniques",
            libelle: "Activités spécialisées, scientifiques et techniques",
            ordre: 11,
          },
          {
            identifiant: "activitesDeServicesAdministratifsEtDeSoutien",
            libelle: "Activités de services administratifs et de soutien",
            ordre: 12,
          },
          { identifiant: "enseignement", libelle: "Enseignement", ordre: 13 },
          {
            identifiant: "santeHumaineEtActionSociale",
            libelle: "Santé humaine et action sociale",
            ordre: 14,
          },
          {
            identifiant: "artsSpectaclesEtActivitesRecreatives",
            libelle: "Arts, spectacles et activités récréatives",
            ordre: 15,
          },
          {
            identifiant: "autresActivitesDeServices",
            libelle: "Autres activités de services",
            ordre: 16,
          },
          {
            identifiant: "servicesAuxMenages",
            libelle: "Services aux ménages",
            ordre: 17,
          },
          {
            identifiant: "activitesExtraTerritoriales",
            libelle: "Activités extra-territoriales",
            ordre: 18,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "nombrePersonnesDansOrganisation",
        libelle: "Combien de personnes compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "nbPersOrg-entre0Et20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant: "nbPersOrg-entre20Et50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant: "nbPersOrg-entre50Et100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant: "nbPersOrg-entre100Et200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant: "nbPersOrg-plusDe200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant: "nbPersOrg-plusDe500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "nombrePostesTravailDansOrganisation",
        libelle: "Combien de postes de travail compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "nbPosOrg-entre0Et20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant: "nbPosOrg-entre20Et50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant: "nbPosOrg-entre50Et100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant: "nbPosOrg-entre100Et200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant: "nbPosOrg-plusDe200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant: "nbPosOrg-plusDe500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "activitesRechercheEtDeveloppement",
        libelle:
          'Votre organisation a-t-elle des activités de "Recherche et Développement" ?',
        reponsesPossibles: [
          {
            identifiant: "REtD-neSaisPas",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "REtD-non", libelle: "Non", ordre: 2 },
          { identifiant: "REtD-oui", libelle: "Oui", ordre: 3 },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "opereSIIndustriels",
        libelle:
          "Votre organisation opère-t-elle des systèmes d'information industriels ?",
        reponsesPossibles: [
          {
            identifiant: "SII-neSaisPas",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "SII-non", libelle: "Non", ordre: 2 },
          { identifiant: "SII-oui", libelle: "Oui", ordre: 3 },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "usageCloud",
        libelle: "Existe t-il un usage du Cloud dans votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "usageCloud-neSaisPas",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "usageCloud-non", libelle: "Non", ordre: 2 },
          {
            identifiant: "usageCloud-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "usageCloudQuestionTiroir",
                libelle: 'Si "Oui": quels sont vos usages du Cloud ?',
                reponsesPossibles: [
                  {
                    identifiant: "usageCloud-Oui-neSaisPas",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant: "usageCloud-Oui-Messagerie",
                    libelle: "Messagerie",
                    ordre: 2,
                  },
                  {
                    identifiant: "usageCloud-Oui-SuiteBureautiqueComplete",
                    libelle: "Suite bureautique complète",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "usageCloud-Oui-HebergementDonneesetSauvegardes",
                    libelle: "Hébergement des données et sauvegardes",
                    ordre: 4,
                  },
                  {
                    identifiant: "usageCloud-Oui-VirtualisationCompleteSI",
                    libelle: "Virtualisation complète du SI",
                    ordre: 5,
                  },
                  {
                    identifiant: "usageCloud-Oui-Autre",
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
        identifiant: "cyberAttaqueSubie",
        libelle: "Avez-vous déjà subi une cyberrataque ?",
        reponsesPossibles: [
          {
            identifiant: "cyberAttaqueSubie-neSaisPas",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "cyberAttaqueSubie-non", libelle: "Non", ordre: 2 },
          {
            identifiant: "cyberAttaqueSubie-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "cyber-attaque-subie-tiroir-type",
                libelle: "Si oui, de quel type ?",
                reponsesPossibles: [
                  {
                    identifiant: "cyber-attaque-subie-oui-type-compromission",
                    libelle: "Compromission d'un poste et/ou d'une boîte mail",
                    ordre: 0,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-type-rancongiciel",
                    libelle:
                      "Rançongiciel ou  autre maliciel sur plusieurs postes",
                    ordre: 1,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-type-fauxOrdre",
                    libelle: "Faux ordre de virement",
                    ordre: 2,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-type-autre",
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
                    identifiant: "cyber-attaque-subie-oui-plainte-neSaisPas",
                    libelle: "Je ne sais pas",
                    ordre: 0,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-plainte-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant: "cyber-attaque-subie-oui-plainte-oui",
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
            identifiant: "gouvernance-ipp-nsp",
            libelle: "Je ne sais pas.",
            ordre: 0,
          },
          { identifiant: "gouvernance-ipp-non", libelle: "Non.", ordre: 1 },
          {
            identifiant: "gouvernance-ipp-oui-idee-generale",
            libelle:
              "Nous avons une idée générale de nos données et processus à protéger en priorité.",
            ordre: 2,
          },
          {
            identifiant: "gouvernance-ipp-oui-precise",
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
                      "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement",
                    libelle: "Etablissement d'un registre de vos traitements",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-traitement-nature-besoin-suppression",
                    libelle:
                      "Pour chaque traitement, détermination de la nature, besoin et finalité des traitements de données personnelles effectuées puis suppression de données non nécessaires",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-analyse-impact",
                    libelle:
                      "Analyse d'impact relative à la protection des données sur les traitements susceptibles d'engendrer un risque élevé",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-info-donnees-finalite",
                    libelle:
                      "Information auprès des personnes concernées des données personnelles traitées et leurs finalités",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-moyen-exercer-valoir-droits",
                    libelle:
                      "Mise en place de moyens permettant aux personnes concernées d'exercer et faire valoir leurs droits (droits d’accès, rectification, opposition, suppression; etc.)",
                    ordre: 4,
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
