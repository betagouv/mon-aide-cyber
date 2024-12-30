import { Knex } from 'knex';

enum TypesUtilisateurs {
  AIDANT = 'AIDANT',
  UTILISATEUR_INSCRIT = 'UTILISATEUR_INSCRIT',
}

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('utilisateurs_mac', (table) => {
    table
      .enum('type', Object.values(TypesUtilisateurs))
      .defaultTo(TypesUtilisateurs.AIDANT);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
