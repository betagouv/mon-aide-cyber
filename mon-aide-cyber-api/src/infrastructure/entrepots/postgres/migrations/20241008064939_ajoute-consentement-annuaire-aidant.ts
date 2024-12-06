import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void | number[]> {
  return knex('utilisateurs').then(async (lignes) => {
    const misesAJour = lignes.map(async (ligne) => {
      return knex('utilisateurs')
        .where('id', ligne.id)
        .update({
          donnees: {
            ...ligne.donnees,
            consentementAnnuaire: false,
          },
        });
    });
    return Promise.all(misesAJour);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(__knex: Knex): Promise<void> {}
