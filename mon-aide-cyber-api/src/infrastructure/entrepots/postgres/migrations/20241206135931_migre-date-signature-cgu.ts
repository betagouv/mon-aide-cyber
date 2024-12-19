import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(
    `
        UPDATE utilisateurs_mac
        SET donnees = jsonb_set(donnees, '{dateSignatureCGU}', to_jsonb(utilisateur.date_signature_cgu))
        FROM (SELECT id, (donnees ->> 'dateSignatureCGU')::timestamp as date_signature_cgu FROM utilisateurs) AS utilisateur(id, date_signature_cgu)
        WHERE utilisateurs_mac.id = utilisateur.id
    `
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(_knex: Knex): Promise<void> {}
