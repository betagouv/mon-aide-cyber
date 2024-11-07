import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await Promise.all([
    knex.raw(
      `
          UPDATE utilisateurs
          SET donnees = donnees #- '{preferences}';
      `
    ),
    knex.raw(
      `
          UPDATE utilisateurs
          SET donnees = donnees #- '{consentementAnnuaire}';
      `
    ),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
