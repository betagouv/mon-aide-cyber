export default {
  client: 'pg',
  connection: process.env.URL_JOURNALISATION_BASE_DONNEES!,
  pool: {
    min: 0,
    max: process.env.BASE_DE_DONNEES_JOURNAL_MAX_POOL
      ? parseInt(process.env.BASE_DE_DONNEES_JOURNAL_MAX_POOL)
      : 10,
  },
};
