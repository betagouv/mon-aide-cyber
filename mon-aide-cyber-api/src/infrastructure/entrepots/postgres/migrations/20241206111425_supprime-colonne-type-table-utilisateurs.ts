import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('utilisateurs', (table) => table.dropColumn('type'));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
