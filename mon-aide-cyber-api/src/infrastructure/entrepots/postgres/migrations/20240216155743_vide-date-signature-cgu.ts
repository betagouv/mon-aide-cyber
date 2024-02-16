import { Knex } from 'knex';
import crypto from 'crypto';
import { DonneesUtilisateur } from '../EntrepotAidantPostgres';

export async function up(knex: Knex): Promise<void | number[]> {
  return knex('utilisateurs').then(
    (
      lignes: {
        id: crypto.UUID;
        type: 'AIDANT' | 'REFERENT';
        donnees: DonneesUtilisateur;
      }[],
    ) => {
      const misesAJour = lignes.map((ligne) => {
        delete ligne.donnees.dateSignatureCharte;
        delete ligne.donnees.dateSignatureCGU;
        return knex('utilisateurs').where('id', ligne.id).update({
          donnees: ligne.donnees,
        });
      });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
