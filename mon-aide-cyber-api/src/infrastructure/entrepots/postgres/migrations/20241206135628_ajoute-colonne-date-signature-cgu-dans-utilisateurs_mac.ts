import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('utilisateurs_mac', (table) =>
    table.datetime('date_signature_cgu')
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
