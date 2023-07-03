import { Referentiel } from "./referentiel";

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
            libelle: "Administration",
            identifiant: "administration",
            ordre: 0,
          },
          { libelle: "Agriculture", identifiant: "agriculture", ordre: 1 },
          { libelle: "Industrie", identifiant: "industrie", ordre: 2 },
          { libelle: "Construction", identifiant: "construction", ordre: 3 },
          { libelle: "Tertiaire", identifiant: "tertiaire", ordre: 4 },
          { libelle: "Commerce", identifiant: "commerce", ordre: 5 },
          { libelle: "Transports", identifiant: "transports", ordre: 6 },
          {
            libelle: "Hébergement et restauration",
            identifiant: "Hébergement et restauration",
            ordre: 7,
          },
          {
            libelle: "Information et communication",
            identifiant: "Information et communication",
            ordre: 8,
          },
          {
            libelle: "Activités financières et d'assurance",
            identifiant: "Activités financières et d'assurance",
            ordre: 9,
          },
          {
            libelle: "Activités immobilières",
            identifiant: "Activités immobilières",
            ordre: 10,
          },
          {
            libelle: "Activités spécialisées, scientifiques et techniques",
            identifiant: "Activités spécialisées, scientifiques et techniques",
            ordre: 11,
          },
          {
            libelle: "Activités de services administratifs et de soutien",
            identifiant: "Activités de services administratifs et de soutien",
            ordre: 12,
          },
          { libelle: "Enseignement", identifiant: "enseignement", ordre: 13 },
          {
            libelle: "Santé humaine et action sociale",
            identifiant: "Santé humaine et action sociale",
            ordre: 14,
          },
          {
            libelle: "Arts, spectacles et activités récréatives",
            identifiant: "Arts, spectacles et activités récréatives",
            ordre: 15,
          },
          {
            libelle: "Autres activités de services",
            identifiant: "Autres activités de services",
            ordre: 16,
          },
          {
            libelle: "Services aux ménages",
            identifiant: "Services aux ménages",
            ordre: 17,
          },
          {
            libelle: "Activités extra-territoriales",
            identifiant: "Activités extra-territoriales",
            ordre: 18,
          },
        ],
      },
      {
        identifiant: "nombrePersonnesDansOrganisation",
        libelle: "Combien de personnes compte votre organisation ?",
        reponsesPossibles: [
          { ordre: 0, libelle: "Entre 0 et 20", identifiant: "entre0Et20" },
          { ordre: 1, libelle: "Entre 20 et 50", identifiant: "entre20Et50" },
          { ordre: 2, libelle: "Entre 50 et 100", identifiant: "entre50Et100" },
          {
            ordre: 3,
            libelle: "Entre 100 et 200",
            identifiant: "entre100Et200",
          },
          { ordre: 4, libelle: "Plus de 200", identifiant: "plusDe200" },
          { ordre: 5, libelle: "Plus de 500", identifiant: "plusDe500" },
        ],
      },
    ],
  },
};

export { referentiel };
