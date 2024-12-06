import { Departement } from '../../../gestion-demandes/departements';

export const mappeurRegionsCSV: Map<string, Departement> = new Map([
  ['ARA', { nom: 'Rhône', code: '69', codeRegion: '84' }], //Auvergne-Rhône-Alpes
  ['BFC', { nom: "Côte-d'Or", code: '21', codeRegion: '27' }], //Bourgogne-Franche-Comté
  ['BR', { nom: 'Ille-et-Vilaine', code: '35', codeRegion: '53' }], //Bretagne
  ['CVL', { nom: 'Loiret', code: '45', codeRegion: '24' }], //Centre-Val de Loire
  ['CORSE', { nom: 'Corse-du-Sud', code: '2A', codeRegion: '94' }], //Corse
  ['DROM COM', { nom: 'Martinique', code: '972', codeRegion: '02' }], //DROM-COM
  ['GE', { nom: 'Bas-Rhin', code: '67', codeRegion: '44' }], //Grand Est
  ['HDF', { nom: 'Nord', code: '59', codeRegion: '32' }], //Hauts-de-France
  ['IDF', { nom: 'Paris', code: '75', codeRegion: '11' }], //Île-de-France
  ['NOR', { nom: 'Seine-Maritime', code: '76', codeRegion: '28' }], //Normandie
  ['NAQ', { nom: 'Gironde', code: '33', codeRegion: '75' }], //Nouvelle-Aquitaine
  ['OCC', { nom: 'Haute-Garonne', code: '31', codeRegion: '76' }], //Occitanie
  [
    'PDL',
    {
      nom: 'Loire-Atlantique',
      code: '44',
      codeRegion: '52',
    },
  ], //Pays de la Loire
  [
    'PACA',
    {
      nom: 'Bouches-du-Rhône',
      code: '13',
      codeRegion: '93',
    },
  ], //Provence-Alpes-Côte d'Azur
]);

export const mappeurDROMCOM: Map<string, Departement> = new Map([
  [
    'Basse-Terre',
    {
      nom: 'Guadeloupe',
      code: '971',
      codeRegion: '01',
    },
  ],
  [
    'Fort-de-France',
    {
      nom: 'Martinique',
      code: '972',
      codeRegion: '02',
    },
  ],
  [
    'Cayenne',
    {
      nom: 'Guyane',
      code: '973',
      codeRegion: '03',
    },
  ],
  [
    'Saint-Denis',
    {
      nom: 'La Réunion',
      code: '974',
      codeRegion: '04',
    },
  ],
  [
    'Mamoudzou',
    {
      nom: 'Mayotte',
      code: '976',
      codeRegion: '06',
    },
  ],
  [
    'Marigot',
    {
      nom: 'Collectivité de Saint-Martin',
      code: '978',
      codeRegion: '978',
    },
  ],
  [
    'Gustavia',
    {
      nom: 'Collectivité de Saint-Barthélémy',
      code: '977',
      codeRegion: '977',
    },
  ],
  [
    'Saint-Pierre',
    {
      nom: 'Collectivité de Saint-Pierre et Miquelon',
      code: '975',
      codeRegion: '975',
    },
  ],
  [
    'Mata-Utu',
    {
      nom: 'Collectivité de Wallis & Futuna',
      code: '986',
      codeRegion: '986',
    },
  ],
  [
    'Papeete',
    {
      nom: 'Collectivité de Polynésie Française',
      code: '987',
      codeRegion: '987',
    },
  ],
  [
    'Nouméa',
    {
      nom: 'Collectivité de Nouvelle-Calédonie',
      code: '988',
      codeRegion: '988',
    },
  ],
]);
