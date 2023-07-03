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
      },
    ],
  },
};

export { referentiel };
