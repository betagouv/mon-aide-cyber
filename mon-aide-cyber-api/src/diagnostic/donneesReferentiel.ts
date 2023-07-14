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
              "Organisation publique (ex. collectivité, organisation centrale)",
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
            question: {
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
                  identifiant: "usageCloud-Oui-HebergementDonneesetSauvegardes",
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
            question: {
              identifiant: "cyberAttaqueSubieTiroir",
              libelle:
                'Si "Oui": avez-vous déposé plainte ou réalisé un signalement auprès d\'un service judiciaire ?',
              reponsesPossibles: [
                {
                  identifiant: "cyberAttaqueSubie-Oui-neSaisPas",
                  libelle: "Je ne sais pas",
                  ordre: 0,
                },
                {
                  identifiant: "cyberAttaqueSubie-Oui-non",
                  libelle: "Non",
                  ordre: 1,
                },
                {
                  identifiant: "cyberAttaqueSubie-Oui-oui",
                  libelle: "Oui",
                  ordre: 2,
                },
              ],
              type: "choixMultiple",
            },
            reponsesComplementaires: [
              {
                identifiant: "cyberAttaqueSubie-Oui-oui-compromission",
                libelle: "Compromission d'un poste et/ou d'une boîte mail",
                ordre: 0,
              },
              {
                identifiant: "cyberAttaqueSubie-Oui-oui-rancongiciel",
                libelle: "Rançongiciel ou  autre maliciel sur plusieurs postes",
                ordre: 1,
              },
              {
                identifiant: "cyberAttaqueSubie-Oui-oui-fauxOrdre",
                libelle: "Faux ordre de virement",
                ordre: 2,
              },
              {
                identifiant: "cyberAttaqueSubie-Oui-oui-autre",
                libelle: "Autre : Préciser",
                ordre: 3,
              },
            ],
          },
        ],
        type: "choixUnique",
      },
    ],
  },
};

export { referentiel };
