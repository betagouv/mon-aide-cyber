export default {
  client: "pg",
  connection: process.env.URL_JOURNALISATION_BASE_DONNEES!,
  pool: { min: 2, max: 10 },
};
