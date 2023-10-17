import { Client } from "pg";

const client = new Client({
  connectionString: process.env.URL_JOURNALISATION_BASE_DONNEES!,
});

client.connect();

const schema = "CREATE SCHEMA journal_mac";
const table =
  "create table journal_mac.evenements (id uuid primary key not null default gen_random_uuid(), date timestamp with time zone, type text, donnees jsonb);";

client.query(schema, (erreur) => {
  if (erreur) console.log("Schema non créé", schema);
});

client.query(table, (erreur) => {
  if (erreur) console.log("Table non créée", erreur);
  client.end();
});
