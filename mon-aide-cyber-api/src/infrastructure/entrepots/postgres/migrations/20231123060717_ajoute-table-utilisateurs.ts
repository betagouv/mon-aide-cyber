import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('utilisateurs', (fabriqueDeTable) => {
    fabriqueDeTable.uuid('id');
    fabriqueDeTable.primary(['id']);
    fabriqueDeTable.enum('type', ['AIDANT', 'REFERENT']);
    fabriqueDeTable.jsonb('donnees');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('utilisateurs');
}
