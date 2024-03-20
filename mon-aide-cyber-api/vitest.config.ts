import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    env: {
      URL_SERVEUR_BASE_DONNEES: process.env.URL_SERVEUR_BASE_DONNEES || 'postgres://postgres@localhost:5434',
      URL_JOURNALISATION_BASE_DONNEES:
        process.env.URL_JOURNALISATION_BASE_DONNEES || 'postgres://postgres@localhost:5434',
    },
    onConsoleLog(log: string): boolean {
      return !log.includes('Une erreur est survenue:');
    },
    environment: 'node',
    globals: true,
  },
});
