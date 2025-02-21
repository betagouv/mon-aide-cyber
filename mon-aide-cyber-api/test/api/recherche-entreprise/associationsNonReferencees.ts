import {
  finistere,
  loiret,
  maineEtLoire,
  mayenne,
  nouvelleCaledonie,
  paris,
  polynesieFrancaise,
  vendee,
} from '../../../src/gestion-demandes/departements';

type AssociationNonReferencee = {
  nom: string;
  siret: string;
  departement: string;
  commune: string;
};

export const associationsNonReferencees: AssociationNonReferencee[] = [
  {
    nom: 'Réserviste de la Gendarmerie',
    siret: '00000000000000',
    departement: paris.code,
    commune: paris.nom,
  },
  {
    nom: 'Unité Nationale Cyber de la Gendarmerie',
    siret: '00000000000000',
    departement: paris.code,
    commune: paris.nom,
  },
  {
    nom: 'Organisation des Professionnels de l’Économie Numérique de Polynésie-Française',
    siret: '00000000000001',
    departement: polynesieFrancaise.code,
    commune: 'Papeete (Tahiti)',
  },
  {
    nom: 'GACYB Bretagne',
    siret: '00000000000002',
    departement: finistere.code,
    commune: 'Brest',
  },
  {
    nom: 'Club des RSSI de Vendée',
    siret: '00000000000003',
    departement: vendee.code,
    commune: 'La Roche-sur-Yon',
  },
  {
    nom: 'Club des RSSI Angevins',
    siret: '00000000000004',
    departement: maineEtLoire.code,
    commune: 'Angers',
  },
  {
    nom: 'Club des RSSI de la Mayenne',
    siret: '00000000000005',
    departement: mayenne.code,
    commune: 'Laval',
  },
  {
    nom: 'Syndicat pour la promotion des Collectivités de Polynésie Française',
    siret: '00000000000006',
    departement: polynesieFrancaise.code,
    commune: 'Papeete (Tahiti)',
  },
  {
    nom: 'Clusir Tahiti',
    siret: '00000000000007',
    departement: polynesieFrancaise.code,
    commune: 'Papeete (Tahiti)',
  },
  {
    nom: 'Centre cyber du Pacifique',
    siret: '00000000000008',
    departement: polynesieFrancaise.code,
    commune: 'Papeete (Tahiti)',
  },
  {
    nom: 'Organisation des Professionnels de l’Économie Numérique de Nouvelle-Calédonie',
    siret: '00000000000010',
    departement: nouvelleCaledonie.code,
    commune: 'Nouméa',
  },
  {
    nom: "Réserve du Commandement des Systèmes d'Information et de Communication",
    siret: '00000000000011',
    departement: paris.code,
    commune: paris.nom,
  },
  {
    nom: 'Réseau des Experts Cybermenaces (RECYM)',
    siret: '00000000000012',
    departement: paris.code,
    commune: paris.nom,
  },
  {
    nom: 'Security Mindset',
    siret: '00000000000013',
    departement: loiret.code,
    commune: 'Orléans',
  },
];
