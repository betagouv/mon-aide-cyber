const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const reactRefresh = require('eslint-plugin-react-refresh');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {},
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
      )
    ),

    settings: {
      react: {
        version: 'detect',
      },
    },

    plugins: {
      'react-refresh': reactRefresh,
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  globalIgnores([
    'mon-aide-cyber-api/',
    '**/*.storybook/',
    '**/*lab-anssi-ui-kit.jsx.d.ts',
    '**/*lab-anssi-ui-kit.iife*.js',
    '**/*eslint.config.cjs',
    '**/*dist',
    '**/node_modules/**',
    '**/*/stories',
  ]),
]);
