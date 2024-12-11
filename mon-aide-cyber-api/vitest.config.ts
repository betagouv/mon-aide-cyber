import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    env: {
      URL_SERVEUR_BASE_DONNEES:
        process.env.URL_SERVEUR_BASE_DONNEES ||
        'postgres://postgres@localhost:5434',
      URL_JOURNALISATION_BASE_DONNEES:
        process.env.URL_JOURNALISATION_BASE_DONNEES ||
        'postgres://postgres@localhost:5434',
      BASE_DE_DONNEES_MIN_POOL: '2',
      BASE_DE_DONNEES_MAX_POOL: '50',
      PRO_CONNECT_ACTIF: 'true',
    },
    onConsoleLog(log: string): boolean {
      return !log.includes('Une erreur est survenue:');
    },
    environment: 'node',
    globals: true,
  },
});
