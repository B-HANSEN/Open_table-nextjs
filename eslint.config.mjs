import reactPlugin from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.tsx', '**/*.ts', '**/*.jsx', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { react: reactPlugin },
    rules: {
      'react/jsx-sort-props': ['error', {
        callbacksLast: false,
        shorthandFirst: false,
        ignoreCase: true,
        reservedFirst: ['key'],
      }],
    },
  },
];
