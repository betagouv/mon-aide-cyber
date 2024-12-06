import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'demandes-auto-diagnostic',
    (fabriqueDeTable) => {
      fabriqueDeTable.uuid('id');
      fabriqueDeTable.primary(['id']);
      fabriqueDeTable.jsonb('donnees');
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('demandes-auto-diagnostic');
}
