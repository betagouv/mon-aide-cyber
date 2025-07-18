import { Knex } from 'knex';
import { adaptateurServiceChiffrement } from '../../../adaptateurs/adaptateurServiceChiffrement';
import crypto from 'crypto';
import { Departement } from '../../../../gestion-demandes/departements';
import { adaptateurEnvironnement } from '../../../../adaptateurs/adaptateurEnvironnement';

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

type EntitesAssociations = {
  nom: 'Associations';
  libelle: 'Associations (ex. association loi 1901, GIP)';
};

type EntitesEntreprisesPrivees = {
  nom: 'Entreprises privées';
  libelle: 'Entreprises privées (ex. TPE, PME, ETI)';
};

type EntitesOrganisationsPubliques = {
  nom: 'Organisations publiques';
  libelle: 'Organisations publiques (ex. collectivité, administration, etc.)';
};

type TypesEntites = (
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

type RepresentationAidant = {
  id: crypto.UUID;
  donnees: {
    email: string;
    nomPrenom: string;
    preferences: Preferences;
    consentementAnnuaire: boolean;
    siret?: string;
    dateSignatureCGU?: Date;
    dateSignatureCharte?: Date;
    entite?: EntiteAidant;
  };
};

type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';

type EntiteAidant = {
  nom?: string;
  siret?: string;
  type: TypeEntite;
};

export async function up(knex: Knex): Promise<void> {
  const serviceDeChiffrement = adaptateurServiceChiffrement();
  knex('utilisateurs_mac')
    .where('type', 'AIDANT')
    .andWhereRaw(
      "(donnees -> 'entite' IS NULL ) OR (donnees -> 'entite' ->> 'siret') IS NULL"
    )
    .then((lignes: RepresentationAidant[]) => {
      const misesAJour = lignes
        .filter((l) =>
          serviceDeChiffrement
            .dechiffre(l.donnees.email)
            .includes('gendarmerie.interieur.gouv.fr')
        )
        .map((l) => {
          return knex('utilisateurs_mac')
            .where('id', l.id)
            .update({
              donnees: {
                ...l.donnees,
                entite: {
                  nom: serviceDeChiffrement.chiffre(
                    'DIRECTION GENERALE DE LA GENDARMERIE NATIONALE (DGGN)'
                  ),
                  siret: serviceDeChiffrement.chiffre(
                    adaptateurEnvironnement.siretsEntreprise().gendarmerie()!
                  ),
                  type: serviceDeChiffrement.chiffre('ServiceEtat'),
                },
              },
            });
        });
      return Promise.all(misesAJour);
    });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__knex: Knex): Promise<void> {}
