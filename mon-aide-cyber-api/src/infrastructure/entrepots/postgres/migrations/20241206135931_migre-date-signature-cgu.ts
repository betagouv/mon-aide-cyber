import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `
        SELECT * FROM "demandes-devenir-aidant";
    `
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
