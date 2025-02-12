import { Entrepot } from '../domaine/Entrepot';
import { Aggregat } from '../domaine/Aggregat';
import { SecteurActivite } from './preferences/secteursActivite';
import { Departement } from '../gestion-demandes/departements';
import { adaptateurEnvironnement } from '../adaptateurs/adaptateurEnvironnement';

export type EntitesOrganisationsPubliques = {
  nom: 'Organisations publiques';
  libelle: 'Organisations publiques (ex. collectivité, administration, etc.)';
};

export type EntitesEntreprisesPrivees = {
  nom: 'Entreprises privées';
  libelle: 'Entreprises privées (ex. TPE, PME, ETI)';
};

export type EntitesAssociations = {
  nom: 'Associations';
  libelle: 'Associations (ex. association loi 1901, GIP)';
};

export const typesEntites: TypesEntites = [
  {
    nom: 'Organisations publiques',
    libelle: 'Organisations publiques (ex. collectivité, administration, etc.)',
  },
  {
    nom: 'Associations',
    libelle: 'Associations (ex. association loi 1901, GIP)',
  },
  {
    nom: 'Entreprises privées',
    libelle: 'Entreprises privées (ex. TPE, PME, ETI)',
  },
];

export type TypesEntites = (
  | EntitesAssociations
  | EntitesEntreprisesPrivees
  | EntitesOrganisationsPubliques
)[];

type Preferences = {
  secteursActivite: SecteurActivite[];
  departements: Departement[];
  typesEntites: TypesEntites;
  nomAffichageAnnuaire: string;
};

export type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';

export type EntiteAidant = {
  nom?: string;
  siret?: string;
  type: TypeEntite;
};
export type Aidant = Aggregat & {
  email: string;
  nomPrenom: string;
  preferences: Preferences;
  consentementAnnuaire: boolean;
  siret?: Siret;
  dateSignatureCGU?: Date;
  dateSignatureCharte?: Date;
  entite?: EntiteAidant;
};

export interface EntrepotAidant extends Entrepot<Aidant> {
  rechercheParEmail(email: string): Promise<Aidant>;
}

export class ErreurCreationEspaceAidant extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

export type Siret = string;
export const estSiretGendarmerie = (siret: string | undefined) =>
  siret === adaptateurEnvironnement.siretsEntreprise().gendarmerie();

export enum TypeAffichageAnnuaire {
  PRENOM_NOM = 'PRENOM_NOM',
  PRENOM_N = 'PRENOM_N',
  P_NOM = 'P_NOM',
}

export const formatteLeNomPrenomSelonRegleAffichage = (
  nomPrenom: string,
  regleAffichage: TypeAffichageAnnuaire
) => {
  switch (regleAffichage) {
    case TypeAffichageAnnuaire.PRENOM_N: {
      const [prenom, nom] = nomPrenom.split(' ');
      return `${prenom} ${nom.at(0)}.`;
    }
    case TypeAffichageAnnuaire.P_NOM: {
      const [prenom, nom] = nomPrenom.split(' ');
      return `${prenom.at(0)}. ${nom}`;
    }
    case TypeAffichageAnnuaire.PRENOM_NOM: {
      return nomPrenom;
    }
  }
};
