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
            identifiant: "gouvernance-schema-si-a-jour-nsp",
            libelle: "Je ne sais pas.",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-schema-si-a-jour-non",
            libelle:
              "Non / Nous avons un schéma historique qui n'est pas à jour",
            ordre: 1,
          },
          {
            identifiant: "gouvernance-schema-si-a-jour-oui-macro",
            libelle:
              'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
            ordre: 2,
          },
          {
            identifiant: "gouvernance-schema-si-a-jour-oui-detaille",
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
            identifiant: "gouvernance-schema-si-industriel-a-jour-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "gouvernance-schema-si-industriel-a-jour-non",
            libelle: "Non.",
            ordre: 1,
          },
          {
            identifiant: "gouvernance-schema-si-industriel-a-jour-oui-partiel",
            libelle:
              'Il existe un schéma "macro" non détaillé ou partiellement détaillé.',
            ordre: 2,
          },
          {
            identifiant: "gouvernance-schema-si-industriel-a-jour-oui-detaille",
            libelle:
              "'Il existe un schéma détaillé, incluant la liste exhaustive des systèmes industrielles, installations matériels connectés et des interconnexions vers l'extérieur.",
            ordre: 3,
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
                      "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-nsp",
                    libelle: "Je ne sais pas / Non applicable",
                    ordre: 0,
                  },

                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-registre-traitement-oui",
                    libelle: "Oui",
                    ordre: 2,
                  },
                ],
              },
              {
                identifiant:
                  "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines",
                libelle:
                  'Si "Oui" : pour chaque traitement, avez-vous déterminé la nature, besoin et finalité des traitements de données personnelles effectuées et supprimer les données non nécessaires ?',
                type: "choixUnique",
                reponsesPossibles: [
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-nsp",
                    libelle: "Je ne sais pas / Non applicable",
                    ordre: 0,
                  },

                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-nature-besoin-finalite-determines-oui",
                    libelle: "Oui",
                    ordre: 2,
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
                      "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-nsp",
                    libelle: "Je ne sais pas / Non applicable",
                    ordre: 0,
                  },

                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "gouvernance-connaissance-rgpd-oui-tiroir-moyens-informer-personnes-mis-en-place-oui",
                    libelle: "Oui",
                    ordre: 2,
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
      {
        identifiant: "gouvernance-exigence-cyber-securite-presta-si-industriel",
        libelle:
          "Si l'entité dispose d'un SI industriel : Des exigences de cybersécurité sont-elles fixées aux prestataires vous accompagnant dans la gestion du système industriel. Font-elles également  l'objet d'une attention particulière ?",
        type: "choixUnique",
        reponsesPossibles: [
          {
            identifiant:
              "gouvernance-exigence-cyber-securite-presta-si-industriel-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant:
              "gouvernance-exigence-cyber-securite-presta-si-industriel-non",
            libelle:
              "Non, aucune exigence ne figure dans nos contrats de prestation",
            ordre: 1,
          },
          {
            identifiant:
              "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-formalisee",
            libelle:
              "Oui, des exigences de cybersécurité sont formalisées et fixées aux prestataires.",
            ordre: 2,
          },
          {
            identifiant:
              "gouvernance-exigence-cyber-securite-presta-si-industriel-oui-fixee",
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
        identifiant: "acces-utilisateurs-administrateurs-poste",
        libelle: "Les utilisateurs sont-ils administrateurs de leur poste ?",
        reponsesPossibles: [
          {
            identifiant: "acces-utilisateurs-administrateurs-poste-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "acces-utilisateurs-administrateurs-poste-oui",
            libelle: "Oui",
            ordre: 1,
          },
          {
            identifiant:
              "acces-utilisateurs-administrateurs-poste-suppression-privilege-en-cours",
            libelle:
              "La suppression de ce privilège est en cours de traitement, plusieurs utilisateurs sont toujours administrateurs de leur poste.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-utilisateurs-administrateurs-poste-non-exceptions-justifiees",
            libelle: "Non, et les rares exceptions sont justifiées.",
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
          "L'accès des utilisateurs aux ressources et données les plus sensibles fait-il l’objet de mesures de sécurité additionnelles ?",
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
              "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees",
            libelle:
              "Oui, des mesures renforçant l'authentification ont été mises en œuvre.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-utilisateurs-donnees-sensibles-mesures-securite-additionnelles-oui-mesures-authentification-renforcees-et-donnees-chiffrees",
            libelle:
              "Oui, des mesures renforçant l'authentification ont été mises en œuvre et les données sont chiffrées.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "acces-teletravail-acces-distants-mesures-particulieres",
        libelle:
          "Le télétravail et les accès distants (cloud inclus) font-ils l'objet de mesures de sécurité particulières ?",
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
              "De l'authentification à double facteurs a été mise en place pour les accès distants.",
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
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "acces-administrateurs-si-mesures-specifiques-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees",
            libelle:
              "Oui, des mesures renforçant l'authentification ont été mises en œuvre.",
            ordre: 2,
          },
          {
            identifiant:
              "acces-administrateurs-si-mesures-specifiques-oui-mesures-authentification-renforcees-postes-dedies-administration",
            libelle:
              "Oui, des mesures renforçant l'authentification ont été mises en œuvre et des postes dédiés à l'administration sont utilisés.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
    ],
  },
  securiteposte: {
    questions: [
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
              "securite-poste-maj-fonctionnelles-et-securite-deployees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions",
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
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-si-industriel-maj-fonctionnelles-et-securite-deployees-systematiquement-avec-exceptions",
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
        identifiant: "securite-poste-si-industriel-antivirus-deploye",
        libelle:
          "Si l'entité dispose d'un SI industriel : Un antivirus à jour est-il déployé sur chaque poste de travail du SI industriel ?",
        reponsesPossibles: [
          {
            identifiant: "securite-poste-si-industriel-antivirus-deploye-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "securite-poste-si-industriel-antivirus-deploye-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-poste-si-industriel-antivirus-deploye-oui-alertes-pas-toujours-traitees",
            libelle: "Oui, mais ses alertes ne sont pas toujours traitées",
            ordre: 2,
          },
          {
            identifiant:
              "securite-poste-si-industriel-antivirus-deploye-oui-alertes-toujours-traitees",
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
              "securite-poste-outils-complementaires-securisation-oui-filtrage-acces-internet",
            libelle: "Oui, un filtrage des accès internet est réalisé.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-poste-outils-complementaires-securisation-oui-outil-complementaire-type-edr",
            libelle:
              "Oui, un outil complémentaire à un antivirus de type EDR a été mis en place.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-poste-r-et-d-disques-chiffres",
        libelle:
          "Si entité avec risque d'espionnage industriel (R&D), les disques durs des matériels nomades nomades sont-ils chiffrés ?",
        reponsesPossibles: [
          {
            identifiant: "securite-poste-r-et-d-disques-chiffres-nsp",
            libelle: "Je ne sais pas / Non applicable",
            ordre: 0,
          },
          {
            identifiant: "securite-poste-r-et-d-disques-chiffres-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant: "securite-poste-r-et-d-disques-chiffres-oui",
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
        identifiant: "securite-infrastructure-pare-feu-deploye",
        libelle: "Un pare-feu physique est-il déployé au niveau du réseau ?",
        reponsesPossibles: [
          {
            identifiant: "securite-infrastructure-pare-feu-deploye-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant: "securite-infrastructure-pare-feu-deploye-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant: "securite-infrastructure-pare-feu-deploye-oui",
            libelle: "Oui",
            questions: [
              {
                identifiant:
                  "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees",
                libelle:
                  'Si "Oui" : protégez-vous les interconnexions de votre système d\'information à Internet et aux réseaux tiers en bloquant tous les flux et les ports non strictement nécessaires ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-interconnexions-protegees-oui",
                    libelle: "Oui",
                    ordre: 2,
                  },
                ],
                type: "choixUnique",
              },
              {
                identifiant:
                  "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes",
                libelle:
                  'Si "Oui" : stockez-vous les logs et les journaux traçant les flux bloqués ainsi que lex flus entrants et sortants de votre parefeu ? ',
                reponsesPossibles: [
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes",
                    libelle:
                      "Oui, nous stockons quelques logs et journaux du pare-feu.",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-pare-feu-deploye-oui-tiroir-logs-stockes-oui-logs-stockes-conserves-6-mois",
                    libelle:
                      "Oui, nous stockons les logs et les journaux du pare-feu avec une durée de conservation d'au moins 6 mois.",
                    ordre: 2,
                  },
                ],
                type: "choixUnique",
              },
            ],
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-infrastructure-si-industriel-pare-feu-deploye",
        libelle:
          "Si l'entité dispose d'un SI industriel : des mesures de cloisonnement spécifiques au système d'information industriel ont-elles été mise en œuvre ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-infrastructure-si-industriel-pare-feu-deploye-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-si-industriel-pare-feu-deploye-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-si-industriel-pare-feu-deploye-oui-flux-necessaires-bloques",
            libelle:
              "Oui, tous les flux et ports non nécessaires sont bloqués.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-si-industriel-pare-feu-deploye-oui-segmentation-stricte",
            libelle:
              "Oui, une segmentation réseau stricte a été mis en œuvre pour isoler l'environnement industriel de l'environnement bureautique (hors besoin métier justifié).",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees",
        libelle:
          "Les mises à jour fonctionnelles et de sécurité des équipements de sécurité sont-elles déployées ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-a-intervalle-regulier",
            libelle:
              "Des mises à jour logicielles sont déployées à intervalle régulier.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees-des-que-possible",
            libelle:
              "Toutes les mises à jour logicielles sont déployées dès que celles-ci sont disponibles et fonctionnelles.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees",
        libelle:
          "Les mises à jour fonctionnelles et de sécurité des systèmes d'exploitation des serveurs, services et logiciels d'admnistration sont-elles déployées ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-a-intervalle-regulier",
            libelle:
              "Des mises à jour logicielles sont déployées à intervalle régulier.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees-des-que-possible",
            libelle:
              "Toutes les mises à jour logicielles sont déployées dès que celles-ci sont disponibles et fonctionnelles.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant:
          "securite-infrastructure-outils-securisation-systeme-messagerie",
        libelle:
          "Des mesures et outils spécifiques sont-ils mis en œuvre pour sécuriser le système de messagerie ?",
        reponsesPossibles: [
          {
            identifiant:
              "securite-infrastructure-outils-securisation-systeme-messagerie-nsp",
            libelle: "Je ne sais pas / Non concerné.",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-outils-securisation-systeme-messagerie-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-outils-securisation-systeme-messagerie-oui",
            libelle: "Oui",
            questions: [
              {
                identifiant:
                  "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-solution-anti-spam",
                libelle:
                  "Si \"Oui\" : avez-vous mis en œuvre d’une solution d'anti-spam et d'anti-hameçonnage permettant de détecter et de bloquer les mails malveillants ?",
                reponsesPossibles: [
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-solution-anti-spam-nsp",
                    libelle: "Je ne sais pas / Non concerné.",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-solution-anti-spam-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-solution-anti-spam-oui",
                    libelle: "Oui",
                    ordre: 1,
                  },
                ],
                type: "choixUnique",
              },
              {
                identifiant:
                  "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-webmail-desactive",
                libelle:
                  'Si "Oui" : avez-vous désactivé le portail type webmail exposé sur internet ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-webmail-desactive-nsp",
                    libelle: "Je ne sais pas / Non concerné.",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-webmail-desactive-non",
                    libelle: "Non",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "securite-infrastructure-outils-securisation-systeme-messagerie-oui-tiroir-webmail-desactive-oui",
                    libelle: "Oui",
                    ordre: 1,
                  },
                ],
                type: "choixUnique",
              },
            ],
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-infrastructure-acces-wifi-securises",
        libelle: "Les points d’accès wifi sont-ils sécurisés?",
        reponsesPossibles: [
          {
            identifiant: "securite-infrastructure-acces-wifi-securises-nsp",
            libelle: "Je ne sais pas / Non Applicable",
            ordre: 0,
          },
          {
            identifiant: "securite-infrastructure-acces-wifi-securises-non",
            libelle: "Non",
            ordre: 0,
          },
          {
            identifiant:
              "securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste",
            libelle: "Oui, le chiffrement de la connexion wifi est robuste.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-acces-wifi-securises-oui-chiffrement-robuste-acces-visiteur-restreint",
            libelle:
              "Oui, le chiffrement de la connexion wifi est robuste et les visiteurs n'ont pas accès au réseau interne.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "securite-infrastructure-espace-stockage-serveurs",
        libelle:
          "L'accès à la salle ou à l'espace dédié au stockage des serveurs d'administration, baies informatiques et des équipements réseau est-il protégé par une porte sécurisée ?",
        reponsesPossibles: [
          {
            identifiant: "securite-infrastructure-espace-stockage-serveurs-nsp",
            libelle: "Je ne sais pas / Non Applicable",
            ordre: 0,
          },
          {
            identifiant: "securite-infrastructure-espace-stockage-serveurs-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef",
            libelle: "Oui, l'accès est sécurisé par une porte fermée à clef.",
            ordre: 2,
          },
          {
            identifiant:
              "securite-infrastructure-espace-stockage-serveurs-oui-porte-ferme-a-clef-videosurveillance",
            libelle:
              "Oui, l'accès est sécurisé par une porte fermée à clef et par un dispositif de vidéosurveillance.",
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
          "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques",
        libelle:
          "Des actions de sensibilisation à la menace et aux bonnes pratiques cyber sont-elles réalisées plusieurs fois par an ?",
        reponsesPossibles: [
          {
            identifiant:
              "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-ponctuellement",
            libelle:
              "Oui, nous menons ponctuellement des actions de sensibilisation.",
            ordre: 2,
          },
          {
            identifiant:
              "sensibilisation-actions-sensibilisation-menace-et-bonnes-pratiques-oui-regulierement",
            libelle:
              "Oui, nous menons régulièrement des actions de sensibilisation ciblant des populations spécifiques.",
            ordre: 3,
          },
        ],
        type: "choixUnique",
      },
      {
        identifiant: "sensibilisation-risque-espionnage-industriel-r-et-d",
        libelle:
          "Si entité avec risque d'espionnage industriel (R&D), menez-vous des actions de sensibilisation ciblant spécifiquement les collaborateurs effectuant des missions à l'étranger ?",
        reponsesPossibles: [
          {
            identifiant:
              "sensibilisation-risque-espionnage-industriel-r-et-d-nsp",
            libelle: "Je ne sais pas / Non applicable.",
            ordre: 0,
          },
          {
            identifiant:
              "sensibilisation-risque-espionnage-industriel-r-et-d-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "sensibilisation-risque-espionnage-industriel-r-et-d-oui",
            libelle: "Oui",
            ordre: 2,
          },
        ],
        type: "choixUnique",
      },
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
              "sensibilisation-collaborateurs-soumis-obligations-usages-securises-oui-charte-communiquee",
            libelle: "Oui, une charte est communiquée aux collaborateurs.",
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
        identifiant: "reaction-surveillance-veille-vulnerabilites-potentielles",
        libelle:
          "Une surveillance ou une veille des vulnérabilités potentielles pouvant vous affecter est-elle réalisée ?",
        reponsesPossibles: [
          {
            identifiant:
              "reaction-surveillance-veille-vulnerabilites-potentielles-nsp",
            libelle: "Je ne sais pas",
            ordre: 0,
          },
          {
            identifiant:
              "reaction-surveillance-veille-vulnerabilites-potentielles-non",
            libelle: "Non",
            ordre: 1,
          },
          {
            identifiant:
              "reaction-surveillance-veille-vulnerabilites-potentielles-veille-ponctuelle",
            libelle: "Réalisation d'une veille ponctuelle sur internet.",
            ordre: 2,
          },
          {
            identifiant:
              "reaction-surveillance-veille-vulnerabilites-potentielles-veille-reguliere",
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
      {
        identifiant: "reaction-assurance-cyber-souscrite",
        libelle: "Votre organisation a-t-elle souscrit à une assurance cyber ?",
        reponsesPossibles: [
          {
            identifiant: "reaction-assurance-cyber-souscrite-nsp",
            libelle: "Je ne sais pas.",
            ordre: 0,
          },
          {
            identifiant: "reaction-assurance-cyber-souscrite-non-pas-pense",
            libelle: "Non, je n'y ai pas pensé.",
            ordre: 1,
          },
          {
            identifiant:
              "reaction-assurance-cyber-souscrite-non-pas-necessaire",
            libelle: "Non, car j'ai évalué que ce n'était pas nécessaire.",
            ordre: 2,
          },
          {
            identifiant: "reaction-assurance-cyber-souscrite-oui",
            libelle: "Oui.",
            questions: [
              {
                identifiant:
                  "reaction-assurance-cyber-souscrite-oui-tiroir-aspects",
                libelle: 'Si "Oui" : Sur quels aspects ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-remediation",
                    libelle:
                      "Aide financière pour financer les opérations de remédiation en cas de cyberattaque",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-financement-pallier-impact-financier",
                    libelle:
                      "Aide financière pour pallier l'impact financier lié à la cyberattaque (ex : pertes d'exploitation)",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-aspects-accompagnement-gestion-crise",
                    libelle: "Accompagnement dans la gestion de crise",
                    ordre: 2,
                  },
                ],
                type: "choixMultiple",
              },
              {
                identifiant:
                  "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite",
                libelle:
                  'Si "Oui" : Etes-vous bien conforme aux conditions d\'applicabilité ?',
                reponsesPossibles: [
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-na",
                    libelle: "Non Applicable",
                    ordre: 0,
                  },
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-nsp",
                    libelle: "Je ne sais pas",
                    ordre: 1,
                  },
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-non",
                    libelle: "Non",
                    ordre: 2,
                  },
                  {
                    identifiant:
                      "reaction-assurance-cyber-souscrite-oui-tiroir-conditions-applicabilite-oui",
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
    ],
  },
};

export { referentiel };
