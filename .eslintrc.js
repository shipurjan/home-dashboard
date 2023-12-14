module.exports = {
  parser: '@typescript-eslint/parser',
  root: true,
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    quotes: ['error', 'single', 'avoid-escape'],
    semi: ['error', 'always'],
    'prettier/prettier': [
      'error',
      { singleQuote: true },
      { endOfLine: 'auto' }
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'error'
  }
};
