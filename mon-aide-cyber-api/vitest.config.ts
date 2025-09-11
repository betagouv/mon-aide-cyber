import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      URL_SERVEUR_BASE_DONNEES:
        process.env.URL_SERVEUR_BASE_DONNEES ||
        'postgres://postgres@localhost:5434',
      URL_JOURNALISATION_BASE_DONNEES:
        process.env.URL_JOURNALISATION_BASE_DONNEES ||
        'postgres://postgres@localhost:5434',
      BASE_DE_DONNEES_MIN_POOL: '10',
      BASE_DE_DONNEES_MAX_POOL: '100',
      PRO_CONNECT_ACTIF: 'true',
      SIRET_GENDARMERIE: 'GENDARMERIE',
      FEATURE_FLAG_ESPACE_AIDANT_ECRAN_PROFIL_MODIFIER_PROFIL: 'true',
      URL_LAB_ANSSI_UTILITAIRES: 'http://lab-anssi-utilitaires.domain',
    },
    onConsoleLog(log: string): boolean {
      return !log.includes('Une erreur est survenue:');
    },
    // Sur la CI, on veut un joli rapport de test
    reporters: process.env.GITHUB_ACTIONS ? ['junit'] : ['verbose'],
    outputFile: process.env.GITHUB_ACTIONS ? './vitest-junit.xml' : '/dev/null',
    globals: true,
  },
});
