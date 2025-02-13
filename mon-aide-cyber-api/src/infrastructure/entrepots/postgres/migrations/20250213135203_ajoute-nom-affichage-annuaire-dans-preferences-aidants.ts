import { Knex } from 'knex';
import crypto from 'crypto';
import {
  formatteLeNomPrenomSelonRegleAffichage,
  TypeAffichageAnnuaire,
} from '../../../../espace-aidant/Aidant';

type EntiteAidant = {
  nom?: string;
  siret?: string;
  type: 'ServicePublic' | 'ServiceEtat' | 'Association';
};

type AidantDTO = {
  email: string;
  nomPrenom: string;
  preferences: Preferences;
  consentementAnnuaire: boolean;
  siret?: string;
  dateSignatureCGU?: Date;
  dateSignatureCharte?: Date;
  entite?: EntiteAidant;
};
type RepresentationAidant = {
  id: crypto.UUID;
  donnees: AidantDTO;
};

type Preferences = {
  secteursActivite: string[];
  departements: string[];
  typesEntites: string[];
  nomAffichageAnnuaire: string;
};

export async function up(knex: Knex): Promise<void | number[]> {
  return knex('utilisateurs_mac').then(
    async (lignes: RepresentationAidant[]) => {
      const misesAJour = lignes.map(async (ligne) => {
        return knex('utilisateurs_mac')
          .where('id', ligne.id)
          .update({
            donnees: {
              ...ligne.donnees,
              preferences: {
                ...ligne.donnees.preferences,
                nomAffichageAnnuaire: formatteLeNomPrenomSelonRegleAffichage(
                  ligne.donnees.nomPrenom,
                  TypeAffichageAnnuaire.PRENOM_N
                ),
              },
            },
          });
      });
      return Promise.all(misesAJour);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  knex('utilisateurs_mac').then((lignes: RepresentationAidant[]) => {
    const misesAJour = lignes.map((ligne) => {
      const donnees = ligne.donnees;
      const { nomAffichageAnnuaire, ...reste } = donnees.preferences;

      return knex('utilisateurs_mac')
        .where('id', ligne.id)
        .update({
          donnees: {
            ...ligne.donnees,
            preferences: {
              ...reste,
            },
          },
        });
    });

    return Promise.all(misesAJour);
  });
}
