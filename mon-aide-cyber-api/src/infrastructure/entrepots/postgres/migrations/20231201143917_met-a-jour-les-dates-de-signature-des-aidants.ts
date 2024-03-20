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
      const misesAJour = lignes
        .filter((ligne) => !ligne.donnees.dateSignatureCGU || !ligne.donnees.dateSignatureCharte)
        .map((ligne) => {
          if (!ligne.donnees.dateSignatureCharte) {
            ligne.donnees.dateSignatureCharte = '2023-11-30T12:00:00+01:00';
          }
          if (!ligne.donnees.dateSignatureCGU) {
            ligne.donnees.dateSignatureCGU = '2023-11-30T12:00:00+01:00';
          }
          return knex('utilisateurs').where('id', ligne.id).update({
            donnees: ligne.donnees,
          });
        });
      return Promise.all(misesAJour);
    },
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__: Knex): Promise<void> {}
