import { Referentiel } from "./Referentiel";

const referentiel: Referentiel = {
  contexte: {
    questions: [
      {
        identifiant: "contexte-nature-organisation",
        libelle: "Quelle est la nature de votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-nature-organisation-organisation-publique",
            libelle:
              "Organisation publique (ex. collectivité, administration, etc.)",
            ordre: 0,
          },
          {
            identifiant: "contexte-nature-organisation-entreprise-privee",
            libelle: "Entreprise privée (ex. TPE, PME, ETI)",
            ordre: 1,
          },
          {
            identifiant: "contexte-nature-organisation-association",
            libelle: "Association (ex. association loi 1901, GIP)",
            ordre: 2,
          },
          {
            identifiant: "contexte-nature-organisation-autre",
            libelle: "Autre : préciser",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-secteur-activite",
        libelle: "Quel est son secteur d'activité ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-secteur-activite-administration",
            libelle: "Administration",
            ordre: 0,
          },
          {
            identifiant: "contexte-secteur-activite-agriculture",
            libelle: "Agriculture",
            ordre: 1,
          },
          {
            identifiant: "contexte-secteur-activite-industrie",
            libelle: "Industrie",
            ordre: 2,
          },
          {
            identifiant: "contexte-secteur-activite-industrie-defense",
            libelle: "Industrie de défense - sous-traitant de l'armée",
            ordre: 3,
          },
          {
            identifiant: "contexte-secteur-activite-construction",
            libelle: "Construction",
            ordre: 3,
          },
          {
            identifiant: "contexte-secteur-activite-tertiaire",
            libelle: "Tertiaire",
            ordre: 4,
          },
          {
            identifiant: "contexte-secteur-activite-commerce",
            libelle: "Commerce",
            ordre: 5,
          },
          {
            identifiant: "contexte-secteur-activite-transports",
            libelle: "Transports",
            ordre: 6,
          },
          {
            identifiant:
              "contexte-secteur-activite-hebergement-et-restauration",
            libelle: "Hébergement et restauration",
            ordre: 7,
          },
          {
            identifiant:
              "contexte-secteur-activite-information-et-communication",
            libelle: "Information et communication",
            ordre: 8,
          },
          {
            identifiant:
              "contexte-secteur-activite-activites-financieres-et-assurance",
            libelle: "Activités financières et d'assurance",
            ordre: 9,
          },
          {
            identifiant: "contexte-secteur-activite-activites-immobilieres",
            libelle: "Activités immobilières",
            ordre: 10,
          },
          {
            identifiant:
              "contexte-secteur-activite-activites-specialisees-scientifiques-et-techniques",
            libelle: "Activités spécialisées, scientifiques et techniques",
            ordre: 11,
          },
          {
            identifiant:
              "contexte-secteur-activite-activites-de-services-administratifs-et-de-soutien",
            libelle: "Activités de services administratifs et de soutien",
            ordre: 12,
          },
          {
            identifiant: "contexte-secteur-activite-enseignement",
            libelle: "Enseignement",
            ordre: 13,
          },
          {
            identifiant:
              "contexte-secteur-activite-sante-humaine-et-action-sociale",
            libelle: "Santé humaine et action sociale",
            ordre: 14,
          },
          {
            identifiant:
              "contexte-secteur-activite-arts-spectacles-et-activites-recreatives",
            libelle: "Arts, spectacles et activités récréatives",
            ordre: 15,
          },
          {
            identifiant:
              "contexte-secteur-activite-autres-activites-de-services",
            libelle: "Autres activités de services",
            ordre: 16,
          },
          {
            identifiant: "contexte-secteur-activite-services-aux-menages",
            libelle: "Services aux ménages",
            ordre: 17,
          },
          {
            identifiant:
              "contexte-secteur-activite-activites-extra-territoriales",
            libelle: "Activités extra-territoriales",
            ordre: 18,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-region-siege-social",
        libelle: "Dans quelle région votre siège social est-il basé ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-region-siege-social-ile-de-France",
            libelle: "Île-de-France",
            ordre: 11,
          },
          {
            identifiant: "contexte-region-siege-social-centre-val-de-loire",
            libelle: "Centre-Val de Loire",
            ordre: 24,
          },
          {
            identifiant: "contexte-region-siege-social-bourgogne-franche-comte",
            libelle: "Bourgogne-Franche-Comté",
            ordre: 27,
          },
          {
            identifiant: "contexte-region-siege-social-normandie",
            libelle: "Normandie",
            ordre: 28,
          },
          {
            identifiant: "contexte-region-siege-social-hauts-de-france",
            libelle: "Hauts-de-France",
            ordre: 32,
          },
          {
            identifiant: "contexte-region-siege-social-grand-est",
            libelle: "Grand Est",
            ordre: 44,
          },
          {
            identifiant: "contexte-region-siege-social-pays-de-la-loire",
            libelle: "Pays de la Loire",
            ordre: 52,
          },
          {
            identifiant: "contexte-region-siege-social-bretagne",
            libelle: "Bretagne",
            ordre: 53,
          },
          {
            identifiant: "contexte-region-siege-social-nouvelle-aquitaine",
            libelle: "Nouvelle-Aquitaine",
            ordre: 75,
          },
          {
            identifiant: "contexte-region-siege-social-occitanie",
            libelle: "Occitanie",
            ordre: 76,
          },
          {
            identifiant: "contexte-region-siege-social-auvergne-rhone-alpes",
            libelle: "Auvergne-Rhône-Alpes",
            ordre: 84,
          },
          {
            identifiant:
              "contexte-region-siege-social-provence-alpes-cote-d-azur",
            libelle: "Provence-Alpes-Côte d'Azur",
            ordre: 93,
          },
          {
            identifiant: "contexte-region-siege-social-corse",
            libelle: "Corse",
            ordre: 94,
          },
          {
            identifiant: "contexte-region-siege-social-guadeloupe",
            libelle: "Guadeloupe",
            ordre: 1,
          },
          {
            identifiant: "contexte-region-siege-social-martinique",
            libelle: "Martinique",
            ordre: 2,
          },
          {
            identifiant: "contexte-region-siege-social-guyane",
            libelle: "Guyane",
            ordre: 3,
          },
          {
            identifiant: "contexte-region-siege-social-la-reunion",
            libelle: "La Réunion",
            ordre: 4,
          },
          {
            identifiant: "contexte-region-siege-social-mayotte",
            libelle: "Mayotte",
            ordre: 6,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-departement-tom-siege-social",
        libelle:
          "Dans quel département, ou Territoire d'Outre Mer, votre siège social est-il basé ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-departement-tom-siege-social-ain",
            libelle: "Ain",
            ordre: 1,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-aisne",
            libelle: "Aisne",
            ordre: 2,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-allier",
            libelle: "Allier",
            ordre: 3,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-alpes-de-haute-provence",
            libelle: "Alpes-de-Haute-Provence",
            ordre: 4,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-hautes-alpes",
            libelle: "Hautes-Alpes",
            ordre: 5,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-alpes-maritimes",
            libelle: "Alpes-Maritimes",
            ordre: 6,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-ardeche",
            libelle: "Ardèche",
            ordre: 7,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-ardennes",
            libelle: "Ardennes",
            ordre: 8,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-ariege",
            libelle: "Ariège",
            ordre: 9,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-aube",
            libelle: "Aube",
            ordre: 10,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-aude",
            libelle: "Aude",
            ordre: 11,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-aveyron",
            libelle: "Aveyron",
            ordre: 12,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-bouches-du-rhone",
            libelle: "Bouches-du-Rhône",
            ordre: 13,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-calvados",
            libelle: "Calvados",
            ordre: 14,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-cantal",
            libelle: "Cantal",
            ordre: 15,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-charente",
            libelle: "Charente",
            ordre: 16,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-charente-maritime",
            libelle: "Charente-Maritime",
            ordre: 17,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-cher",
            libelle: "Cher",
            ordre: 18,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-correze",
            libelle: "Corrèze",
            ordre: 19,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-cote-d-or",
            libelle: "Côte-d'Or",
            ordre: 21,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-côtes-d-armor",
            libelle: "Côtes-d'Armor",
            ordre: 22,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-creuse",
            libelle: "Creuse",
            ordre: 23,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-dordogne",
            libelle: "Dordogne",
            ordre: 24,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-doubs",
            libelle: "Doubs",
            ordre: 25,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-drome",
            libelle: "Drôme",
            ordre: 26,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-eure",
            libelle: "Eure",
            ordre: 27,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-eure-et-loir",
            libelle: "Eure-et-Loir",
            ordre: 28,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-finistere",
            libelle: "Finistère",
            ordre: 29,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-corse-du-sud",
            libelle: "Corse-du-Sud",
            ordre: 2,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-corse",
            libelle: "Haute-Corse",
            ordre: 2,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-gard",
            libelle: "Gard",
            ordre: 30,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-garonne",
            libelle: "Haute-Garonne",
            ordre: 31,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-gers",
            libelle: "Gers",
            ordre: 32,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-gironde",
            libelle: "Gironde",
            ordre: 33,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-herault",
            libelle: "Hérault",
            ordre: 34,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-ille-et-vilaine",
            libelle: "Ille-et-Vilaine",
            ordre: 35,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-indre",
            libelle: "Indre",
            ordre: 36,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-indre-et-loire",
            libelle: "Indre-et-Loire",
            ordre: 37,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-isere",
            libelle: "Isère",
            ordre: 38,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-jura",
            libelle: "Jura",
            ordre: 39,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-landes",
            libelle: "Landes",
            ordre: 40,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-loir-et-cher",
            libelle: "Loir-et-Cher",
            ordre: 41,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-loire",
            libelle: "Loire",
            ordre: 42,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-loire",
            libelle: "Haute-Loire",
            ordre: 43,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-loire-atlantique",
            libelle: "Loire-Atlantique",
            ordre: 44,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-loiret",
            libelle: "Loiret",
            ordre: 45,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-lot",
            libelle: "Lot",
            ordre: 46,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-lot-et-garonne",
            libelle: "Lot-et-Garonne",
            ordre: 47,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-lozere",
            libelle: "Lozère",
            ordre: 48,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-maine-et-loire",
            libelle: "Maine-et-Loire",
            ordre: 49,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-manche",
            libelle: "Manche",
            ordre: 50,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-marne",
            libelle: "Marne",
            ordre: 51,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-marne",
            libelle: "Haute-Marne",
            ordre: 52,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-mayenne",
            libelle: "Mayenne",
            ordre: 53,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-meurthe-et-moselle",
            libelle: "Meurthe-et-Moselle",
            ordre: 54,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-meuse",
            libelle: "Meuse",
            ordre: 55,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-morbihan",
            libelle: "Morbihan",
            ordre: 56,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-moselle",
            libelle: "Moselle",
            ordre: 57,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-nievre",
            libelle: "Nièvre",
            ordre: 58,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-nord",
            libelle: "Nord",
            ordre: 59,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-oise",
            libelle: "Oise",
            ordre: 60,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-orne",
            libelle: "Orne",
            ordre: 61,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-pas-de-calais",
            libelle: "Pas-de-Calais",
            ordre: 62,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-puy-de-dome",
            libelle: "Puy-de-Dôme",
            ordre: 63,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-pyrenees-atlantiques",
            libelle: "Pyrénées-Atlantiques",
            ordre: 64,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-hautes-pyrenees",
            libelle: "Hautes-Pyrénées",
            ordre: 65,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-pyrenees-orientales",
            libelle: "Pyrénées-Orientales",
            ordre: 66,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-bas-rhin",
            libelle: "Bas-Rhin",
            ordre: 67,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haut-rhin",
            libelle: "Haut-Rhin",
            ordre: 68,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-rhone",
            libelle: "Rhône",
            ordre: 69,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-saone",
            libelle: "Haute-Saône",
            ordre: 70,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-saone-et-loire",
            libelle: "Saône-et-Loire",
            ordre: 71,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-sarthe",
            libelle: "Sarthe",
            ordre: 72,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-savoie",
            libelle: "Savoie",
            ordre: 73,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-savoie",
            libelle: "Haute-Savoie",
            ordre: 74,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-paris",
            libelle: "Paris",
            ordre: 75,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-seine-maritime",
            libelle: "Seine-Maritime",
            ordre: 76,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-seine-et-marne",
            libelle: "Seine-et-Marne",
            ordre: 77,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-yvelines",
            libelle: "Yvelines",
            ordre: 78,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-deux-sevres",
            libelle: "Deux-Sèvres",
            ordre: 79,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-somme",
            libelle: "Somme",
            ordre: 80,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-tarn",
            libelle: "Tarn",
            ordre: 81,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-tarn-et-garonne",
            libelle: "Tarn-et-Garonne",
            ordre: 82,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-var",
            libelle: "Var",
            ordre: 83,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-vaucluse",
            libelle: "Vaucluse",
            ordre: 84,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-vendee",
            libelle: "Vendée",
            ordre: 85,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-vienne",
            libelle: "Vienne",
            ordre: 86,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-haute-vienne",
            libelle: "Haute-Vienne",
            ordre: 87,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-vosges",
            libelle: "Vosges",
            ordre: 88,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-yonne",
            libelle: "Yonne",
            ordre: 89,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-territoire-de-belfort",
            libelle: "Territoire de Belfort",
            ordre: 90,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-essonne",
            libelle: "Essonne",
            ordre: 91,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-hauts-de-seine",
            libelle: "Hauts-de-Seine",
            ordre: 92,
          },
          {
            identifiant:
              "contexte-departement-tom-siege-social-seine-saint-denis",
            libelle: "Seine-Saint-Denis",
            ordre: 93,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-val-de-marne",
            libelle: "Val-de-Marne",
            ordre: 94,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-val-d-oise",
            libelle: "Val-d'Oise",
            ordre: 95,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-guadeloupe",
            libelle: "Guadeloupe",
            ordre: 971,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-martinique",
            libelle: "Martinique",
            ordre: 972,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-guyane",
            libelle: "Guyane",
            ordre: 973,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-la-reunion",
            libelle: "La Réunion",
            ordre: 974,
          },
          {
            identifiant: "contexte-departement-tom-siege-social-mayotte",
            libelle: "Mayotte",
            ordre: 976,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-nombre-personnes-dans-organisation",
        libelle: "Combien de personnes compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-entre-0-et-20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-entre-20-et-50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-entre-50-et-100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-entre-100-et-200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-plus-de-200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant:
              "contexte-nombre-personnes-dans-organisation-plus-de-500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-nombre-postes-travail-dans-organisation",
        libelle: "Combien de postes de travail compte votre organisation ?",
        reponsesPossibles: [
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-entre-0-et-20",
            libelle: "Entre 0 et 20",
            ordre: 0,
          },
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-entre-20-et-50",
            libelle: "Entre 20 et 50",
            ordre: 1,
          },
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-entre-50-et-100",
            libelle: "Entre 50 et 100",
            ordre: 2,
          },
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-entre-100-et-200",
            libelle: "Entre 100 et 200",
            ordre: 3,
          },
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-plus-de-200",
            libelle: "Plus de 200",
            ordre: 4,
          },
          {
            identifiant:
              "contexte-nombre-postes-travail-dans-organisation-plus-de-500",
            libelle: "Plus de 500",
            ordre: 5,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-activites-recherche-et-developpement",
        libelle:
          'Votre organisation a-t-elle des activités de "Recherche et Développement" ?',
        reponsesPossibles: [
          {
            identifiant: "contexte-activites-recherche-et-developpement-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          {
            identifiant: "contexte-activites-recherche-et-developpement-non",
            libelle: "Non",
            ordre: 2,
          },
          {
            identifiant: "contexte-activites-recherche-et-developpement-oui",
            libelle: "Oui",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-opere-systemes-information-industriels",
        libelle:
          "Votre organisation opère-t-elle des systèmes d'information industriels ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-opere-systemes-information-industriels-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          {
            identifiant: "contexte-opere-systemes-information-industriels-non",
            libelle: "Non",
            ordre: 2,
          },
          {
            identifiant: "contexte-opere-systemes-information-industriels-oui",
            libelle: "Oui",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "contexte-usage-cloud",
        libelle: "Existe t-il un usage du Cloud dans votre organisation ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-usage-cloud-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          { identifiant: "contexte-usage-cloud-non", libelle: "Non", ordre: 2 },
          {
            identifiant: "contexte-usage-cloud-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "contexte-usage-cloud-oui-question-tiroir-usages",
                libelle: 'Si "Oui": quels sont vos usages du Cloud ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-messagerie",
                    libelle: "Messagerie",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-suite-bureautique-complete",
                    libelle: "Suite bureautique complète",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-hebergement-donnees-et-sauvegardes",
                    libelle: "Hébergement des données et sauvegardes",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-virtualisation-complete-si",
                    libelle: "Virtualisation complète du SI",
                    ordre: 5,
                  },
                  {
                    identifiant:
                      "contexte-usage-cloud-oui-question-tiroir-usages-autre",
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
        identifiant: "contexte-cyber-attaque-subie",
        libelle: "Avez-vous déjà subi une cyberrataque ?",
        reponsesPossibles: [
          {
            identifiant: "contexte-cyber-attaque-subie-nsp",
            libelle: "Je ne sais pas",
            ordre: 1,
          },
          {
            identifiant: "contexte-cyber-attaque-subie-non",
            libelle: "Non",
            ordre: 2,
          },
          {
            identifiant: "contexte-cyber-attaque-subie-oui",
            libelle: "Oui",
            ordre: 3,
            questions: [
              {
                identifiant: "contexte-cyber-attaque-subie-oui-tiroir-type",
                libelle: "Si oui, de quel type ?",
                reponsesPossibles: [
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-oui-tiroir-type-compromission",
                    libelle: "Compromission d'un poste et/ou d'une boîte mail",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-oui-tiroir-type-rancongiciel",
                    libelle:
                      "Rançongiciel ou  autre maliciel sur plusieurs postes",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-oui-tiroir-type-faux-ordre",
                    libelle: "Faux ordre de virement",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-oui-tiroir-type-autre",
                    libelle: "Autre : Préciser",
                    ordre: 3,
                  },
                ],
                type: "choixMultiple",
              },
              {
                identifiant: "contexte-cyber-attaque-subie-tiroir-plainte",
                libelle:
                  'Si "Oui": avez-vous déposé plainte ou réalisé un signalement auprès d\'un service judiciaire ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-tiroir-plainte-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-tiroir-plainte-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "contexte-cyber-attaque-subie-tiroir-plainte-oui",
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
                    libelle: "Établissement d'un registre de vos traitements",
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
  SecuriteAcces: {
    questions: [
      {
        identifiant: "acces-outil-gestion-des-comptes",
        libelle:
          "Un outil de gestion des comptes et des politiques de sécurité centralisé (ex : Active Directory, Samba-AD, Azure AD) est-il déployé au sein du système d'information ?",
        reponsesPossibles: [
          {
            identifiant: "acces-outil-gestion-des-comptes-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "acces-outil-gestion-des-comptes-oui",
            libelle: "Oui",
            ordre: 2,
          },
          {
            identifiant: "acces-outil-gestion-des-comptes-non",
            libelle: "Non",
            ordre: 1,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-liste-compte-utilisateurs",
        libelle:
          "La liste des comptes des utilisateurs (prestataires inclus) ayant le droit d'accéder au système et application est-elle maintenue à jour ?",
        reponsesPossibles: [
          {
            identifiant: "acces-liste-compte-utilisateurs-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "acces-liste-compte-utilisateurs-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant: "acces-liste-compte-utilisateurs-revue-reguliere",
            libelle:
              "Les comptes des utilisateurs et leurs accès sont régulièrement revus (ex : liste du personnel vs liste des comptes).",
            ordre: 2,
          },
          {
            identifiant: "acces-liste-compte-utilisateurs-revue-en-continu",
            libelle:
              "La liste des comptes des utilisateurs est mise à jour en continu dans le cadre d'un processus de suppression systématique des comptes inactifs. Une revue annuelle est également réalisée.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-droits-acces-utilisateurs-limites",
        libelle:
          "Les droits d'accès des utilisateurs aux données, aux systèmes et aux applications métiers sont-ils limités à leurs besoins métiers ?",
        reponsesPossibles: [
          {
            identifiant: "acces-droits-acces-utilisateurs-limites-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "acces-droits-acces-utilisateurs-limites-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-droits-acces-utilisateurs-limites-restrictions-ponctuelles",
            libelle:
              "Des restrictions d’accès à certaines données sont ponctuellement mises en place.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-droits-acces-utilisateurs-limites-restrictions-limitees",
            libelle:
              "L’accès des utilisateurs aux données, aux systèmes et aux applications sont limités aux seuls accès nécessaires à leur activité.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-administrateurs-informatiques-suivie-et-limitee",
        libelle:
          "La liste des comptes des administrateurs informatiques (prestataires inclus) est-elle suivie et limitée au strict nécessaire ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-administrateurs-informatiques-suivie-et-limitee-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "acces-administrateurs-informatiques-suivie-et-limitee-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-administrateurs-informatiques-suivie-et-limitee-revue-reguliere",
            libelle:
              "Les comptes des administrateurs sont régulièrement revus (ex : liste du personnel vs liste des comptes).",
            ordre: 2,
          },
          {
            identifiant:
              "acces-administrateurs-informatiques-suivie-et-limitee-revue-continue",
            libelle:
              "La liste des comptes des administrateurs est mise à jour en continu dans le cadre d'un processus de suppression systématique des comptes inactifs. Une revue annuelle est également réalisée.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-utilisation-comptes-administrateurs-droits-limitee",
        libelle:
          "L'utilisation des comptes administrateurs et des droits d'accès d'administration est-elle bien limitée aux tâches d'administration ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-utilisation-comptes-administrateurs-droits-limitee-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "acces-utilisation-comptes-administrateurs-droits-limitee-non",
            libelle:
              "Non, des utilisateurs disposent de privilèges d’administration sans restrictions particulières.",
            ordre: 1,
          },
          {
            identifiant:
              "acces-utilisation-comptes-administrateurs-droits-quelques-restrictions",
            libelle:
              "La mise à disposition des comptes d'administration et des droits d'accès d'administration fait l'objet de quelques restrictions.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-utilisation-comptes-administrateurs-droits-justifies",
            libelle:
              "Tous les comptes administration et tous les accès d'administration sont justifiés, dédiés et utilisés aux seules tâches d'administration.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-mesures-securite-robustesse-mdp",
        libelle:
          "Avez-vous mis en place des mesures de sécurité particulières afin de renforcer la robustesse des mots de passe permettant aux utilisateurs d'accéder à leur session ?",
        reponsesPossibles: [
          {
            identifiant: "acces-mesures-securite-robustesse-mdp-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "acces-mesures-securite-robustesse-mdp-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-mesures-securite-robustesse-mdp-utilisateurs-sensibilises",
            libelle:
              "Les utilisateurs sont sensibilisés à la gestion sécurisée de leurs mots de passe.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-mesures-securite-robustesse-mdp-contraintes-par-defaut",
            libelle:
              "Des contraintes en matière de sécurité des mots de passe sont exigées par défaut pour l'accès des utilisateurs à leur compte.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles",
        libelle:
          "L'accès des utilisateurs aux ressources et données sensibles fait-il l’objet de mesures de sécurité additionnelles ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant:
              "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui",
            libelle: "Oui",
            ordre: 2,
            questions: [
              {
                identifiant:
                  "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures",
                libelle: 'Si "Oui" : combien de mesures parmi celles-ci ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-longueur-mdp",
                    libelle:
                      "Contraintes renforcées de robustesse et de longueur de mots de passe",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-acces-distants-securises",
                    libelle:
                      "Connexion via accès distants sécurisés (VPN, bastion, etc.)",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-mfa",
                    libelle: "Authentification multi facteur",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-chiffrement",
                    libelle: "Chiffrement des données",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-data-loss-prevention",
                    libelle:
                      "Utilisation d'une solution de Data Loss Prevention permettant de limiter les fuites de données",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-rebut-disques",
                    libelle:
                      "Procédure de suppression et mise à rebut des disques",
                    ordre: 5,
                  },
                  {
                    identifiant:
                      "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-question-tiroir-combien-messures-autre-messure",
                    libelle: "Autre mesure jugée acceptable par l'aidant",
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
        identifiant: "acces-teletravail-acces-distants-mesures-particulieres",
        libelle:
          "Le télétravail et les accès distants font-ils l'objet de mesures de sécurité particulières ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-teletravail-acces-distants-mesures-particulieres-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant:
              "acces-teletravail-acces-distants-mesures-particulieres-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-teletravail-acces-distants-mesures-particulieres-mfa",
            libelle:
              "De l'authentification à double facteurs a été mise en place pour les accès distants.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-teletravail-acces-distants-mesures-particulieres-vpn",
            libelle: "Les connexions à distance sont réalisées via un VPN.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "acces-si-industriel-teletravail-acces-distants-mesures-particulieres",
        libelle:
          "Si l'entité dispose d'un SI industriel : les accès distants sur les machines, outils et SI industriels font-ils l'objet de mesures de sécurité particulières ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant:
              "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-mfa",
            libelle:
              "De l'authentification à double facteurs a été mis en place pour les accès distants.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-si-industriel-teletravail-acces-distants-mesures-particulieres-vpn",
            libelle: "Les connexions à distance sont réalisées via un VPN.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-entite-dispose-plusieurs-sites-geographiques",
        libelle:
          "Si l'entité dispose de plusieurs sites géographiques interconnectés, et si à risque d'espionnage industriel : les interconnexions \"site à site\" font-elles l'objet de mesures de sécurité particulières ?",
        reponsesPossibles: [
          {
            identifiant:
              "acces-entite-dispose-plusieurs-sites-geographiques-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant:
              "acces-entite-dispose-plusieurs-sites-geographiques-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-entite-dispose-plusieurs-sites-geographiques-oui",
            libelle: 'Oui les interconnexions "site à site" sont chiffrées.',
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-administrateurs-si-mesures-specifiques",
        libelle:
          "Les accès des administrateurs aux systèmes d'information font-ils l’objet de mesures de sécurité spécifiques ?",
        reponsesPossibles: [
          {
            identifiant: "acces-administrateurs-si-mesures-specifiques-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "acces-administrateurs-si-mesures-specifiques-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant: "acces-administrateurs-si-mesures-specifiques-oui",
            libelle: "Oui",
            questions: [
              {
                identifiant:
                  "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures",
                libelle: 'Si "Oui" : combien de mesures parmi celles-ci ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-contrainte-robustesse-mdp",
                    libelle:
                      "Contraintes renforcées de robustesse et de longueur de mots de passe",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-coffre-fort",
                    libelle: "Utilisation de coffre forts de mot de passe",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-modification-mdp-systematique",
                    libelle:
                      "Modification systématique des mots de passe par défaut",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-mfa",
                    libelle: "Authentification multi facteur",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-poste-dedie",
                    libelle:
                      "Postes d’administration dédiés aux fonctions d'administration.",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-solution-gestion-acces-privileges",
                    libelle:
                      "Utilisation d'une solution de gestion des accès à privilèges (PAM, bastion, portail d'authentification).",
                    ordre: 5,
                  },
                  {
                    identifiant:
                      "acces-administrateurs-si-mesures-specifiques-oui-question-tiroir-combien-mesures-autre-mesure-acceptable",
                    libelle: "Autre mesure jugée acceptable par l'aidant.",
                    ordre: 6,
                  },
                ],
                type: "choixMultiple",
              },
            ],
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  securiteposte: {
    questions: [
      {
        identifiant: "securite-poste-utilisateurs-administrateurs-poste",
        libelle: "Les utilisateurs sont-ils administrateurs de leur poste ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-poste-utilisateurs-administrateurs-poste-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },

          {
            identifiant:
              "securite-poste-utilisateurs-administrateurs-poste-oui",
            libelle: "Oui",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-utilisateurs-administrateurs-poste-non",
            libelle: "Non, et les rares exceptions sont justifiées.",
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-poste-maj-fonctionnelles-et-securite-deployees",
        libelle:
          "Les mises à jour fonctionnelles et de sécurité des logiciels utilisés sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-poste-maj-fonctionnelles-et-securite-deployees-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },

          {
            identifiant:
              "securite-poste-maj-fonctionnelles-et-securite-deployees-oui",
            libelle: "Oui",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-excetpions",
            libelle:
              "Les mises à jour sont déployées systématiquement, il existe tout de même certaines exceptions non traitées actuellement.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles",
            libelle:
              "Toutes les mises à jour sont déployées systématiquement dès que celles-ci sont disponibles et les exceptions font l'objet de mesures complémentaires.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees",
        libelle:
          "Si l'entité dispose d'un SI industriel : Les mises à jour fonctionnelles et de sécurité sont-elles déployées sur les postes de travail des utilisateurs et des administrateurs ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },

          {
            identifiant:
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-oui",
            libelle: "Oui",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-excetpions",
            libelle:
              "Les mises à jour sont déployées systématiquement, il existe tout de même certaines exceptions non traitées actuellement.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-des-que-disponibles",
            libelle:
              "Toutes les mises à jour sont déployées systématiquement dès que celles-ci sont disponibles et les exceptions font l'objet de mesures complémentaires.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-poste-antivirus-deploye",
        libelle:
          "Un antivirus à jour est-il déployé sur chaque poste de travail ?",
        reponsesPossibles: [
          {
            identifiant: "securite-poste-antivirus-deploye-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },

          {
            identifiant: "securite-poste-antivirus-deploye-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-antivirus-deploye-oui-alertes-pas-toujours-traitees",
            libelle: "Oui, mais ses alertes ne sont pas toujours traitées",
            ordre: 2,
          },
          {
            identifiant:
              "securite-poste-antivirus-deploye-oui-alertes-toujours-traitees",
            libelle: "Oui et ses alertes sont systématiquement traitées.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-poste-pare-feu-local-active",
        libelle: "Un pare-feu local est-il activé sur les postes de travail ?",
        reponsesPossibles: [
          {
            identifiant: "securite-poste-pare-feu-local-active-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "securite-poste-pare-feu-local-active-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant: "securite-poste-pare-feu-local-active-oui",
            libelle: "Oui",
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-poste-outils-complementaires-securisation",
        libelle:
          "Des outils complémentaires de sécurisation des postes de travail et de la navigation internet sont-ils en place ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-poste-outils-complementaires-securisation-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },

          {
            identifiant:
              "securite-poste-outils-complementaires-securisation-non",
            libelle: "Non",
            ordre: 1,
          },

          {
            identifiant:
              "securite-poste-outils-complementaires-securisation-oui",
            libelle: "Oui",
            questions: [
              {
                identifiant:
                  "securite-poste-outils-complementaires-securisation-oui-outils",
                libelle: 'Si "Oui" : combien d\'outils parmi ceux-ci ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-proxy",
                    libelle: "Filtrage web (proxy)",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-mecanisme-securite-transactions-bancaires",
                    libelle: "Mécanisme de sécurité des transactions bancaires",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-blocage-clef-usb",
                    libelle:
                      "Contrôle voire blocage des clefs USB externes (ou via station blanche)",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-protection-complement-edr",
                    libelle:
                      "Outil de protection des postes utilisateurs complémentaires à un antivirus de type EDR (Endpoint Detection and Response)",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-chiffrement-disques",
                    libelle:
                      "Pour les entités ayant un risque d'espionnage industriel : Chiffrement des disques des postes et des terminaux nomades",
                    ordre: 4,
                  },
                  {
                    identifiant:
                      "securite-poste-outils-complementaires-securisation-oui-outils-autre-outil-acceptable",
                    libelle: "Autre outil jugé acceptable par l'aidant",
                    ordre: 5,
                  },
                ],
                type: "choixMultiple",
              },
            ],
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "securite-poste-configuration-securisee-standardisee-et-homogene",
        libelle:
          "Tous les postes de travail bénéficient-ils d'une configuration sécurisée standardisée et homogène sur l'ensemble du parc ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-poste-configuration-securisee-standardisee-et-homogene-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },

          {
            identifiant:
              "securite-poste-configuration-securisee-standardisee-et-homogene-non",
            libelle: "Non",
            ordre: 1,
          },

          {
            identifiant:
              "securite-poste-configuration-securisee-standardisee-et-homogene-oui",
            libelle: "Oui",
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  securiteinfrastructure: {
    questions: [
      {
        identifiant:
          "securite-infrastructure-mises-a-jour-fonctionnelles-securite-deployees",
        libelle:
          "Les mises à jour fonctionnelles et de sécurité des serveurs, des équipements, des systèmes et logiciels d'administration sont-elles déployées ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-deployees-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-deployees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-deployees-a-intervalle-regulier",
            libelle:
              "Des mises à jour logicielles sont déployées à intervalle régulier.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-deployees-des-que-possible",
            libelle:
              "Toutes les mises à jour logicielles sont déployées dès que celles-ci sont disponibles et fonctionnelles.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  sensibilisation: {
    questions: [
      {
        identifiant:
          "sensibilisation-collaborateurs-soumis-obligations-usages-securises",
        libelle:
          "Les collaborateurs sont-ils soumis à des obligations en matière d'usages sécurisés des moyens informatiques ?",
        reponsesPossibles: [
          {
            identifiant:
              "sensibilisation-collaborateurs-soumis-obligations-usages-securises-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "sensibilisation-collaborateurs-soumis-obligations-usages-securises-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui",
            libelle: "Oui",
            ordre: 2,
          },
          {
            identifiant:
              "sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-signee",
            libelle:
              "Oui, une charte est signée par chaque collaborateur et elle est annexée au règlement intérieur.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "sensibilisation-declaration-incidents-encouragee",
        libelle:
          "La déclaration d'incidents de sécurité par les salariés est-elle encouragée et facilitée ?",
        reponsesPossibles: [
          {
            identifiant: "sensibilisation-declaration-incidents-encouragee-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "sensibilisation-declaration-incidents-encouragee-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "sensibilisation-declaration-incidents-encouragee-non-habitude-utilisateurs-contactent-informaticien",
            libelle:
              "Non, mais dans la majorité des cas, les utilisateurs ont pris l'habitude de contacter un informaticien en cas de doute ou d'incident.",
            ordre: 2,
          },
          {
            identifiant: "sensibilisation-declaration-incidents-encouragee-oui",
            libelle: "Oui",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  reaction: {
    questions: [
      {
        identifiant: "reaction-moyens-identification-vulnerabilites-en-place",
        libelle:
          "Des moyens d'identification des vulnérabilités potentielles sont-ils en place, notamment pour les systèmes et applications ne se mettant pas à jour automatiquement ?",
        reponsesPossibles: [
          {
            identifiant:
              "reaction-moyens-identification-vulnerabilites-en-place-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "reaction-moyens-identification-vulnerabilites-en-place-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "reaction-moyens-identification-vulnerabilites-en-place-veille-ponctuelle",
            libelle: "Réalisation d'une veille ponctuelle sur internet.",
            ordre: 2,
          },
          {
            identifiant:
              "reaction-moyens-identification-vulnerabilites-en-place-veille-reguliere",
            libelle: "Réalisation d'une veille régulière et exhaustive.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "reaction-sauvegardes-donnees-realisees",
        libelle:
          "Des sauvegardes régulières des données et des systèmes d'information sont-elles réalisées ?",
        reponsesPossibles: [
          {
            identifiant: "reaction-sauvegardes-donnees-realisees-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "reaction-sauvegardes-donnees-realisees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "reaction-sauvegardes-donnees-realisees-oui-ponctuellement",
            libelle:
              "Des sauvegardes des données et des systèmes d'information sont réalisées ponctuellement.",
            questions: [
              {
                identifiant:
                  "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole",
                libelle:
                  'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’internet ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-na",
                    libelle: "Non applicable",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-non",
                    libelle: "Non",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui",
                    libelle: "Oui",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-environnement-isole-oui-jeu-chiffre",
                    libelle:
                      "Oui, et le jeu de sauvegarde externalisé est chiffré",
                    ordre: 4,
                  },
                ],
                type: "choixUnique",
              },
              {
                identifiant:
                  "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement",
                libelle:
                  'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-na",
                    libelle: "Non applicable",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-non",
                    libelle: "Non",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-ponctuellement-tiroir-sauvegarde-testee-regulierement-oui",
                    libelle: "Oui",
                    ordre: 3,
                  },
                ],
                type: "choixUnique",
              },
            ],
            ordre: 2,
          },
          {
            identifiant:
              "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere",
            libelle:
              "Des sauvegardes des données et des systèmes sont réalisées de manière automatique et régulière",
            questions: [
              {
                identifiant:
                  "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole",
                libelle:
                  'Si "Oui" : Existe-t-il au moins une sauvegarde des données critiques stockées dans un environnement isolé du réseau bureautique interne et d’internet ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-na",
                    libelle: "Non applicable",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-non",
                    libelle: "Non",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui",
                    libelle: "Oui",
                    ordre: 3,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-environnement-isole-oui-jeu-chiffre",
                    libelle:
                      "Oui, et le jeu de sauvegarde externalisé est chiffré",
                    ordre: 4,
                  },
                ],
                type: "choixUnique",
              },
              {
                identifiant:
                  "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement",
                libelle:
                  'Si "Oui" : La restauration de toutes les sauvegardes est-elle testée régulièrement ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-na",
                    libelle: "Non applicable",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-non",
                    libelle: "Non",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "reaction-sauvegardes-donnees-realisees-oui-automatique-et-reguliere-tiroir-sauvegarde-testee-regulierement-oui",
                    libelle: "Oui",
                    ordre: 3,
                  },
                ],
                type: "choixUnique",
              },
            ],
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "reaction-dispositif-gestion-crise-adapte-defini",
        libelle:
          "Un dispositif de gestion de crise adapté au risque de cyberattaques a-t-il été défini ?",
        reponsesPossibles: [
          {
            identifiant: "reaction-dispositif-gestion-crise-adapte-defini-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "reaction-dispositif-gestion-crise-adapte-defini-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "reaction-dispositif-gestion-crise-adapte-defini-oui-fiche-reflexe",
            libelle: "Nous avons défini une fiche réflexe dédiée.",
            ordre: 2,
          },
          {
            identifiant:
              "reaction-dispositif-gestion-crise-adapte-defini-oui-organisation-gestion-crise-definie",
            libelle:
              "Oui, une organisation de gestion de crise d'origine cyber a été définie",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
};

export { referentiel };
