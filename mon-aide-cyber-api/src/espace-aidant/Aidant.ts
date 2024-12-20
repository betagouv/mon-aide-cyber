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
};

export type Aidant = Aggregat & {
  email: string;
  nomPrenom: string;
  preferences: Preferences;
  consentementAnnuaire: boolean;
  siret?: Siret;
  dateSignatureCGU?: Date;
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
