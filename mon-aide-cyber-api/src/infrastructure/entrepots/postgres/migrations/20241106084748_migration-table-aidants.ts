import { Knex } from 'knex';
import crypto from 'crypto';
import { Departement } from '../../../../gestion-demandes/departements';

type DonneesUtilisateur = {
  id: crypto.UUID;
  donnees: Utilisateur;
};

type Utilisateur = {
  identifiantConnexion: string;
  nomPrenom: string;
  dateSignatureCGU?: Date;
  preferences: Preferences;
  consentementAnnuaire: boolean;
};

type EntitesOrganisationsPubliques = {
  nom: 'Organisations publiques';
  libelle: 'Organisations publiques (ex. collectivité, administration, etc.)';
};

type EntitesEntreprisesPrivees = {
  nom: 'Entreprises privées';
  libelle: 'Entreprises privées (ex. TPE, PME, ETI)';
};

type EntitesAssociations = {
  nom: 'Associations';
  libelle: 'Associations (ex. association loi 1901, GIP)';
};

type TypesEntites = (
  | EntitesAssociations
  | EntitesEntreprisesPrivees
  | EntitesOrganisationsPubliques
)[];

type SecteurActivite = {
  nom:
    | 'Administration'
    | 'Agriculture, sylviculture'
    | 'Agroalimentaire'
    | 'Industrie'
    | 'Industrie de défense'
    | 'Construction'
    | 'Tertiaire'
    | 'Commerce'
    | 'Transports'
    | 'Hébergement et restauration'
    | 'Information et communication'
    | "Activités financières et d'assurance"
    | 'Activités immobilières'
    | 'Activités spécialisées, scientifiques et techniques'
    | 'Activités de services administratifs et de soutien'
    | 'Enseignement'
    | 'Santé et action sociale'
    | 'Recherche, laboratoire'
    | 'Santé humaine et action sociale'
    | 'Arts, spectacles et activités récréatives'
    | 'Autres activités de services'
    | 'Services aux ménages'
    | 'Activités extra-territoriales';
};

type Preferences = {
  secteursActivite: SecteurActivite[];
  departements: Departement[];
  typesEntites: TypesEntites;
};

export async function up(knex: Knex): Promise<void> {
  knex('utilisateurs').then(async (lignes: DonneesUtilisateur[]) => {
    const aidants = lignes.map((ligne) => ({
      id: ligne.id,
      donnees: {
        email: ligne.donnees.identifiantConnexion,
        nomPrenom: ligne.donnees.nomPrenom,
        preferences: {
          secteursActivite: ligne.donnees.preferences.secteursActivite,
          departements: ligne.donnees.preferences.departements,
          typesEntites: ligne.donnees.preferences.typesEntites,
        },
        consentementAnnuaire: ligne.donnees.consentementAnnuaire,
      },
    }));
    if (aidants.length > 0) {
      await knex.insert(aidants).into('aidants');
    }
    return Promise.resolve();
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.delete().from('aidants');
}
