import { QuestionsThematique } from '../Referentiel';

export const donneesContexte: QuestionsThematique = {
  questions: [
    {
      identifiant: 'contexte-cgu-signees',
      libelle: 'Avez-vous signé les CGU ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-nature-cgu-signe-oui',
          libelle: 'oui',
          ordre: 0,
        },
        {
          identifiant: 'contexte-nature-cgu-signe-non',
          libelle: 'non',
          ordre: 1,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-nature-organisation',
      libelle: 'Quelle est la nature de votre organisation ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-nature-organisation-organisation-publique',
          libelle:
            'Organisation publique (ex : collectivité, administration, syndicats mixte, GIP etc.)',
          ordre: 0,
        },
        {
          identifiant: 'contexte-nature-organisation-entreprise-privee',
          libelle: 'Entreprise privée (ex : TPE, PME, ETI)',
          ordre: 1,
        },
        {
          identifiant: 'contexte-nature-organisation-association',
          libelle: 'Association (ex : association loi 1901)',
          ordre: 2,
        },
        {
          identifiant: 'contexte-nature-organisation-autre',
          libelle: 'Autre : préciser',
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-secteur-activite',
      libelle: "Quel est son secteur d'activité ?",
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-secteur-activite-administration',
          libelle: 'Administration',
          ordre: 0,
        },
        {
          identifiant: 'contexte-secteur-activite-agriculture',
          libelle: 'Agriculture, sylviculture',
          ordre: 1,
        },
        {
          identifiant: 'contexte-secteur-activite-agroalimentaire',
          libelle: 'Agroalimentaire',
          ordre: 2,
        },
        {
          identifiant: 'contexte-secteur-activite-industrie',
          libelle: 'Industrie',
          ordre: 3,
        },
        {
          identifiant: 'contexte-secteur-activite-industrie-defense',
          libelle: 'Industrie de défense',
          ordre: 4,
        },
        {
          identifiant: 'contexte-secteur-activite-construction',
          libelle: 'Construction',
          ordre: 5,
        },
        {
          identifiant: 'contexte-secteur-activite-tertiaire',
          libelle: 'Tertiaire',
          ordre: 6,
        },
        {
          identifiant: 'contexte-secteur-activite-commerce',
          libelle: 'Commerce',
          ordre: 7,
        },
        {
          identifiant: 'contexte-secteur-activite-transports',
          libelle: 'Transports',
          ordre: 8,
        },
        {
          identifiant: 'contexte-secteur-activite-hebergement-et-restauration',
          libelle: 'Hébergement et restauration',
          ordre: 9,
        },
        {
          identifiant: 'contexte-secteur-activite-information-et-communication',
          libelle: 'Information et communication',
          ordre: 10,
        },
        {
          identifiant:
            'contexte-secteur-activite-activites-financieres-et-assurance',
          libelle: "Activités financières et d'assurance",
          ordre: 11,
        },
        {
          identifiant: 'contexte-secteur-activite-activites-immobilieres',
          libelle: 'Activités immobilières',
          ordre: 12,
        },
        {
          identifiant:
            'contexte-secteur-activite-activites-specialisees-scientifiques-et-techniques',
          libelle: 'Activités spécialisées, scientifiques et techniques',
          ordre: 13,
        },
        {
          identifiant:
            'contexte-secteur-activite-activites-de-services-administratifs-et-de-soutien',
          libelle: 'Activités de services administratifs et de soutien',
          ordre: 14,
        },
        {
          identifiant: 'contexte-secteur-activite-enseignement',
          libelle: 'Enseignement',
          ordre: 15,
        },
        {
          identifiant: 'contexte-secteur-activite-santé',
          libelle: 'Santé et action sociale',
          ordre: 16,
        },
        {
          identifiant: 'contexte-secteur-activite-recherche',
          libelle: 'Recherche, laboratoire',
          ordre: 17,
        },
        {
          identifiant:
            'contexte-secteur-activite-sante-humaine-et-action-sociale',
          libelle: 'Santé humaine et action sociale',
          ordre: 18,
        },
        {
          identifiant:
            'contexte-secteur-activite-arts-spectacles-et-activites-recreatives',
          libelle: 'Arts, spectacles et activités récréatives',
          ordre: 19,
        },
        {
          identifiant: 'contexte-secteur-activite-autres-activites-de-services',
          libelle: 'Autres activités de services',
          ordre: 20,
        },
        {
          identifiant: 'contexte-secteur-activite-services-aux-menages',
          libelle: 'Services aux ménages',
          ordre: 21,
        },
        {
          identifiant:
            'contexte-secteur-activite-activites-extra-territoriales',
          libelle: 'Activités extra-territoriales',
          ordre: 22,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-region-siege-social',
      libelle: 'Dans quelle région votre siège social est-il basé ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-region-siege-social-auvergne-rhone-alpes',
          libelle: 'Auvergne-Rhône-Alpes',
          ordre: 1,
        },
        {
          identifiant: 'contexte-region-siege-social-bourgogne-franche-comte',
          libelle: 'Bourgogne-Franche-Comté',
          ordre: 2,
        },
        {
          identifiant: 'contexte-region-siege-social-bretagne',
          libelle: 'Bretagne',
          ordre: 3,
        },
        {
          identifiant: 'contexte-region-siege-social-centre-val-de-loire',
          libelle: 'Centre-Val de Loire',
          ordre: 4,
        },
        {
          identifiant: 'contexte-region-siege-social-corse',
          libelle: 'Corse',
          ordre: 5,
        },
        {
          identifiant: 'contexte-region-siege-social-drom-com',
          libelle: 'DROM-COM',
          ordre: 6,
        },
        {
          identifiant: 'contexte-region-siege-social-grand-est',
          libelle: 'Grand Est',
          ordre: 7,
        },
        {
          identifiant: 'contexte-region-siege-social-hauts-de-france',
          libelle: 'Hauts-de-France',
          ordre: 8,
        },
        {
          identifiant: 'contexte-region-siege-social-ile-de-France',
          libelle: 'Île-de-France',
          ordre: 9,
        },
        {
          identifiant: 'contexte-region-siege-social-normandie',
          libelle: 'Normandie',
          ordre: 10,
        },
        {
          identifiant: 'contexte-region-siege-social-nouvelle-aquitaine',
          libelle: 'Nouvelle-Aquitaine',
          ordre: 11,
        },
        {
          identifiant: 'contexte-region-siege-social-occitanie',
          libelle: 'Occitanie',
          ordre: 12,
        },
        {
          identifiant: 'contexte-region-siege-social-pays-de-la-loire',
          libelle: 'Pays de la Loire',
          ordre: 13,
        },
        {
          identifiant:
            'contexte-region-siege-social-provence-alpes-cote-d-azur',
          libelle: "Provence-Alpes-Côte d'Azur",
          ordre: 14,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-departement-tom-siege-social',
      libelle:
        'Dans quel département, ou DROM-COM, votre siège social est-il basé ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-departement-tom-siege-social-ain',
          libelle: 'Ain',
          ordre: 1,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-aisne',
          libelle: 'Aisne',
          ordre: 2,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-allier',
          libelle: 'Allier',
          ordre: 3,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-alpes-de-haute-provence',
          libelle: 'Alpes-de-Haute-Provence',
          ordre: 4,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-hautes-alpes',
          libelle: 'Hautes-Alpes',
          ordre: 5,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-alpes-maritimes',
          libelle: 'Alpes-Maritimes',
          ordre: 6,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-ardeche',
          libelle: 'Ardèche',
          ordre: 7,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-ardennes',
          libelle: 'Ardennes',
          ordre: 8,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-ariege',
          libelle: 'Ariège',
          ordre: 9,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-aube',
          libelle: 'Aube',
          ordre: 10,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-aude',
          libelle: 'Aude',
          ordre: 11,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-aveyron',
          libelle: 'Aveyron',
          ordre: 12,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-bouches-du-rhone',
          libelle: 'Bouches-du-Rhône',
          ordre: 13,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-calvados',
          libelle: 'Calvados',
          ordre: 14,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-cantal',
          libelle: 'Cantal',
          ordre: 15,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-charente',
          libelle: 'Charente',
          ordre: 16,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-charente-maritime',
          libelle: 'Charente-Maritime',
          ordre: 17,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-cher',
          libelle: 'Cher',
          ordre: 18,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-correze',
          libelle: 'Corrèze',
          ordre: 19,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-cote-d-or',
          libelle: "Côte-d'Or",
          ordre: 21,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-côtes-d-armor',
          libelle: "Côtes-d'Armor",
          ordre: 22,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-creuse',
          libelle: 'Creuse',
          ordre: 23,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-dordogne',
          libelle: 'Dordogne',
          ordre: 24,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-doubs',
          libelle: 'Doubs',
          ordre: 25,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-drome',
          libelle: 'Drôme',
          ordre: 26,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-eure',
          libelle: 'Eure',
          ordre: 27,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-eure-et-loir',
          libelle: 'Eure-et-Loir',
          ordre: 28,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-finistere',
          libelle: 'Finistère',
          ordre: 29,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-corse-du-sud',
          libelle: 'Corse-du-Sud',
          ordre: 2,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-corse',
          libelle: 'Haute-Corse',
          ordre: 2,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-gard',
          libelle: 'Gard',
          ordre: 30,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-garonne',
          libelle: 'Haute-Garonne',
          ordre: 31,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-gers',
          libelle: 'Gers',
          ordre: 32,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-gironde',
          libelle: 'Gironde',
          ordre: 33,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-herault',
          libelle: 'Hérault',
          ordre: 34,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-ille-et-vilaine',
          libelle: 'Ille-et-Vilaine',
          ordre: 35,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-indre',
          libelle: 'Indre',
          ordre: 36,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-indre-et-loire',
          libelle: 'Indre-et-Loire',
          ordre: 37,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-isere',
          libelle: 'Isère',
          ordre: 38,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-jura',
          libelle: 'Jura',
          ordre: 39,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-landes',
          libelle: 'Landes',
          ordre: 40,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-loir-et-cher',
          libelle: 'Loir-et-Cher',
          ordre: 41,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-loire',
          libelle: 'Loire',
          ordre: 42,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-loire',
          libelle: 'Haute-Loire',
          ordre: 43,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-loire-atlantique',
          libelle: 'Loire-Atlantique',
          ordre: 44,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-loiret',
          libelle: 'Loiret',
          ordre: 45,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-lot',
          libelle: 'Lot',
          ordre: 46,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-lot-et-garonne',
          libelle: 'Lot-et-Garonne',
          ordre: 47,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-lozere',
          libelle: 'Lozère',
          ordre: 48,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-maine-et-loire',
          libelle: 'Maine-et-Loire',
          ordre: 49,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-manche',
          libelle: 'Manche',
          ordre: 50,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-marne',
          libelle: 'Marne',
          ordre: 51,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-marne',
          libelle: 'Haute-Marne',
          ordre: 52,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-mayenne',
          libelle: 'Mayenne',
          ordre: 53,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-meurthe-et-moselle',
          libelle: 'Meurthe-et-Moselle',
          ordre: 54,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-meuse',
          libelle: 'Meuse',
          ordre: 55,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-morbihan',
          libelle: 'Morbihan',
          ordre: 56,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-moselle',
          libelle: 'Moselle',
          ordre: 57,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-nievre',
          libelle: 'Nièvre',
          ordre: 58,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-nord',
          libelle: 'Nord',
          ordre: 59,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-oise',
          libelle: 'Oise',
          ordre: 60,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-orne',
          libelle: 'Orne',
          ordre: 61,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-pas-de-calais',
          libelle: 'Pas-de-Calais',
          ordre: 62,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-puy-de-dome',
          libelle: 'Puy-de-Dôme',
          ordre: 63,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-pyrenees-atlantiques',
          libelle: 'Pyrénées-Atlantiques',
          ordre: 64,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-hautes-pyrenees',
          libelle: 'Hautes-Pyrénées',
          ordre: 65,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-pyrenees-orientales',
          libelle: 'Pyrénées-Orientales',
          ordre: 66,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-bas-rhin',
          libelle: 'Bas-Rhin',
          ordre: 67,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haut-rhin',
          libelle: 'Haut-Rhin',
          ordre: 68,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-rhone',
          libelle: 'Rhône',
          ordre: 69,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-saone',
          libelle: 'Haute-Saône',
          ordre: 70,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-saone-et-loire',
          libelle: 'Saône-et-Loire',
          ordre: 71,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-sarthe',
          libelle: 'Sarthe',
          ordre: 72,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-savoie',
          libelle: 'Savoie',
          ordre: 73,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-savoie',
          libelle: 'Haute-Savoie',
          ordre: 74,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-paris',
          libelle: 'Paris',
          ordre: 75,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-seine-maritime',
          libelle: 'Seine-Maritime',
          ordre: 76,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-seine-et-marne',
          libelle: 'Seine-et-Marne',
          ordre: 77,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-yvelines',
          libelle: 'Yvelines',
          ordre: 78,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-deux-sevres',
          libelle: 'Deux-Sèvres',
          ordre: 79,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-somme',
          libelle: 'Somme',
          ordre: 80,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-tarn',
          libelle: 'Tarn',
          ordre: 81,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-tarn-et-garonne',
          libelle: 'Tarn-et-Garonne',
          ordre: 82,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-var',
          libelle: 'Var',
          ordre: 83,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-vaucluse',
          libelle: 'Vaucluse',
          ordre: 84,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-vendee',
          libelle: 'Vendée',
          ordre: 85,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-vienne',
          libelle: 'Vienne',
          ordre: 86,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-haute-vienne',
          libelle: 'Haute-Vienne',
          ordre: 87,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-vosges',
          libelle: 'Vosges',
          ordre: 88,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-yonne',
          libelle: 'Yonne',
          ordre: 89,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-territoire-de-belfort',
          libelle: 'Territoire de Belfort',
          ordre: 90,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-essonne',
          libelle: 'Essonne',
          ordre: 91,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-hauts-de-seine',
          libelle: 'Hauts-de-Seine',
          ordre: 92,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-seine-saint-denis',
          libelle: 'Seine-Saint-Denis',
          ordre: 93,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-val-de-marne',
          libelle: 'Val-de-Marne',
          ordre: 94,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-val-d-oise',
          libelle: "Val-d'Oise",
          ordre: 95,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-guadeloupe',
          libelle: 'Guadeloupe',
          ordre: 971,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-martinique',
          libelle: 'Martinique',
          ordre: 972,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-guyane',
          libelle: 'Guyane',
          ordre: 973,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-la-reunion',
          libelle: 'La Réunion',
          ordre: 974,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-mayotte',
          libelle: 'Mayotte',
          ordre: 976,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-saintmartin',
          libelle: 'Collectivité de Saint-Martin',
          ordre: 977,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-saintbarthélémy',
          libelle: 'Collectivité de Saint-Barthélémy',
          ordre: 978,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-saintpierreetmiquelon',
          libelle: 'Collectivité de Saint-Pierre et Miquelon',
          ordre: 979,
        },
        {
          identifiant: 'contexte-departement-tom-siege-social-wallisetfutuna',
          libelle: 'Collectivité de Wallis & Futuna',
          ordre: 980,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-polynésiefrançaise',
          libelle: 'Collectivité de Polynésie Française',
          ordre: 981,
        },
        {
          identifiant:
            'contexte-departement-tom-siege-social-nouvellecalédonie',
          libelle: 'Collectivité de Nouvelle-Calédonie',
          ordre: 982,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-nombre-personnes-dans-organisation',
      libelle: 'Combien de personnes compte votre organisation ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant:
            'contexte-nombre-personnes-dans-organisation-entre-1-et-9',
          libelle: 'Entre 1 et 9',
          ordre: 0,
        },
        {
          identifiant:
            'contexte-nombre-personnes-dans-organisation-entre-10-et-49',
          libelle: 'Entre 10 et 49',
          ordre: 1,
        },
        {
          identifiant:
            'contexte-nombre-personnes-dans-organisation-entre-50-et-249',
          libelle: 'Entre 50 et 249',
          ordre: 2,
        },
        {
          identifiant:
            'contexte-nombre-personnes-dans-organisation-plus-de-250',
          libelle: 'Plus de 250',
          ordre: 4,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-nombre-postes-travail-dans-organisation',
      libelle: 'Combien de postes de travail compte votre organisation ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant:
            'contexte-nombre-postes-travail-dans-organisation-entre-1-et-9',
          libelle: 'Entre 1 et 9',
          ordre: 0,
        },
        {
          identifiant:
            'contexte-nombre-postes-travail-dans-organisation-entre-10-et-49',
          libelle: 'Entre 10 et 49',
          ordre: 1,
        },
        {
          identifiant:
            'contexte-nombre-postes-travail-dans-organisation-entre-50-et-249',
          libelle: 'Entre 50 et 249',
          ordre: 2,
        },
        {
          identifiant:
            'contexte-nombre-postes-travail-dans-organisation-plus-de-250',
          libelle: 'Plus de 250',
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-activites-recherche-et-developpement',
      libelle:
        'Estimez-vous que votre entité puisse faire l’objet d’espionnage ciblé ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-activites-recherche-et-developpement-non',
          libelle: 'Non',
          ordre: 1,
        },
        {
          identifiant: 'contexte-activites-recherche-et-developpement-oui',
          libelle: 'Oui',
          ordre: 2,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-opere-systemes-information-industriels',
      libelle: 'Votre organisation opère-t-elle des systèmes industriels ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-opere-systemes-information-industriels-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'contexte-opere-systemes-information-industriels-non',
          libelle: 'Non',
          ordre: 2,
        },
        {
          identifiant: 'contexte-opere-systemes-information-industriels-oui',
          libelle: 'Oui',
          ordre: 3,
        },
      ],
      type: 'choixUnique',
    },
    {
      identifiant: 'contexte-cyber-attaque-subie',
      libelle: 'Avez-vous déjà subi une cyberattaque ?',
      poids: 0,
      reponsesPossibles: [
        {
          identifiant: 'contexte-cyber-attaque-subie-nsp',
          libelle: 'Je ne sais pas',
          ordre: 1,
        },
        {
          identifiant: 'contexte-cyber-attaque-subie-non',
          libelle: 'Non',
          ordre: 2,
        },
        {
          identifiant: 'contexte-cyber-attaque-subie-oui',
          libelle: 'Oui',
          ordre: 3,
          questions: [
            {
              identifiant: 'contexte-cyber-attaque-subie-oui-tiroir-type',
              libelle: 'Si oui, de quel type ?',
              poids: 0,
              reponsesPossibles: [
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-compromission',
                  libelle:
                    "Compromission d'un poste, d'une boîte mail ou d'un compte Cloud",
                  ordre: 0,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-usurpation',
                  libelle: "Usurpation d'identité",
                  ordre: 1,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-rancongiciel',
                  libelle:
                    'Rançongiciel ou autre maliciel sur plusieurs postes',
                  ordre: 2,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-accès',
                  libelle: "Compromission d'un ou plusieurs accès distants",
                  ordre: 3,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-web',
                  libelle: "Compromission d'un ou plusieurs services web",
                  ordre: 4,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-serveur',
                  libelle:
                    "Compromission d'un serveur ou service exposé sur internet",
                  ordre: 5,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-reseaux',
                  libelle:
                    "Compromission d'un ou plusieurs équipements réseaux",
                  ordre: 6,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-compromission-indirecte',
                  libelle:
                    'Compromission indirecte via un prestataire ou un partenaire',
                  ordre: 7,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-oui-tiroir-type-malveillance',
                  libelle: 'Malveillance interne',
                  ordre: 8,
                },
              ],
              type: 'choixMultiple',
            },
            {
              identifiant: 'contexte-cyber-attaque-subie-tiroir-plainte',
              libelle:
                'Si "Oui": avez-vous déposé plainte ou réalisé un signalement auprès d\'un service judiciaire ?',
              poids: 0,
              reponsesPossibles: [
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-tiroir-plainte-nsp',
                  libelle: 'Je ne sais pas',
                  ordre: 0,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-tiroir-plainte-non',
                  libelle: 'Non',
                  ordre: 1,
                },
                {
                  identifiant:
                    'contexte-cyber-attaque-subie-tiroir-plainte-oui',
                  libelle: 'Oui',
                  ordre: 2,
                },
              ],
              type: 'choixUnique',
            },
          ],
        },
      ],
      type: 'choixUnique',
    },
  ],
};
