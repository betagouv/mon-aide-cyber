import { SecteurActivite } from '../../espace-aidant/preferences/secteursActivite';

export type LettreSecteur =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U';
type EquivalenceSecteurActivite = {
  lettreSecteur: LettreSecteur;
  libelleSecteur: string;
  secteursMAC: SecteurActivite[];
};

export const equivalenceSecteursActivite: EquivalenceSecteurActivite[] = [
  {
    lettreSecteur: 'A',
    libelleSecteur: 'Agriculture, sylviculture et pêche',
    secteursMAC: [{ nom: 'Agriculture, sylviculture' }],
  },
  {
    lettreSecteur: 'B',
    libelleSecteur: 'Industries extractives',
    secteursMAC: [{ nom: 'Industrie' }],
  },
  {
    lettreSecteur: 'C',
    libelleSecteur: 'Industrie manufacturière',
    secteursMAC: [{ nom: 'Industrie de défense' }, { nom: 'Industrie' }],
  },
  {
    lettreSecteur: 'D',
    libelleSecteur:
      'Production et distribution d’électricité, de gaz, de vapeur et d’air conditionné',
    secteursMAC: [{ nom: 'Industrie' }],
  },
  {
    lettreSecteur: 'E',
    libelleSecteur:
      'Production et distribution d’eau ; assainissement, gestion des déchets et dépollution',
    secteursMAC: [{ nom: 'Industrie' }],
  },
  {
    lettreSecteur: 'F',
    libelleSecteur: 'Construction',
    secteursMAC: [{ nom: 'Construction' }],
  },
  {
    lettreSecteur: 'G',
    libelleSecteur: 'Commerce ; réparation d’automobiles et de motocycles',
    secteursMAC: [{ nom: 'Commerce' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'H',
    libelleSecteur: 'Transports et entreposage',
    secteursMAC: [{ nom: 'Transports' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'I',
    libelleSecteur: 'Hébergement et restauration',
    secteursMAC: [{ nom: 'Hébergement et restauration' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'J',
    libelleSecteur: 'Information et communication',
    secteursMAC: [
      { nom: 'Information et communication' },
      { nom: 'Tertiaire' },
    ],
  },
  {
    lettreSecteur: 'K',
    libelleSecteur: 'Activités financières et d’assurance',
    secteursMAC: [
      { nom: "Activités financières et d'assurance" },
      { nom: 'Tertiaire' },
    ],
  },
  {
    lettreSecteur: 'L',
    libelleSecteur: 'Activités immobilières',
    secteursMAC: [{ nom: 'Activités immobilières' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'M',
    libelleSecteur: 'Activités spécialisées, scientifiques et techniques',
    secteursMAC: [
      { nom: 'Activités spécialisées, scientifiques et techniques' },
      { nom: 'Recherche, laboratoire' },
    ],
  },
  {
    lettreSecteur: 'N',
    libelleSecteur: 'Activités de services administratifs et de soutien',
    secteursMAC: [
      { nom: 'Activités de services administratifs et de soutien' },
    ],
  },
  {
    lettreSecteur: 'O',
    libelleSecteur: 'Administration publique',
    secteursMAC: [{ nom: 'Administration' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'P',
    libelleSecteur: 'Enseignement',
    secteursMAC: [{ nom: 'Enseignement' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'Q',
    libelleSecteur: 'Santé humaine et action sociale',
    secteursMAC: [
      { nom: 'Santé humaine et action sociale' },
      { nom: 'Santé et action sociale' },
      { nom: 'Tertiaire' },
    ],
  },
  {
    lettreSecteur: 'R',
    libelleSecteur: 'Arts, spectacles et activités récréatives',
    secteursMAC: [{ nom: 'Arts, spectacles et activités récréatives' }],
  },
  {
    lettreSecteur: 'S',
    libelleSecteur: 'Autres activités de services',
    secteursMAC: [{ nom: 'Autres activités de services' }],
  },
  {
    lettreSecteur: 'T',
    libelleSecteur:
      'Activités des ménages en tant qu’employeurs ; activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre',
    secteursMAC: [{ nom: 'Services aux ménages' }, { nom: 'Tertiaire' }],
  },
  {
    lettreSecteur: 'U',
    libelleSecteur: 'Activités extra-territoriales',
    secteursMAC: [{ nom: 'Activités extra-territoriales' }],
  },
];
