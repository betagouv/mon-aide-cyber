import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    // Sur la CI, on veut un joli rapport de test
    reporters: process.env.GITHUB_ACTIONS ? ['junit'] : ['verbose'],
    outputFile: process.env.GITHUB_ACTIONS
      ? { junit: './vitest-junit.xml' }
      : '/dev/null',
  },
});
