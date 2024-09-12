import { Knex } from 'knex';
import { StatutDemande } from '../../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('demandes-devenir-aidant', (table) => {
    table
      .enum('statut', Object.values(StatutDemande), {
        useNative: true,
        enumName: 'STATUT_DEMANDE',
      })
      .defaultTo(StatutDemande.EN_COURS);
  });
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
