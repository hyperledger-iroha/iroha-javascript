module.exports = {
  extends: ['alloy', 'alloy/typescript'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'no-promise-executor-return': 'off',
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  globals: {
    BigInt: true,
    globalThis: true,
  },
  overrides: [
    {
      files: ['**/test/integration/test-web/cypress/**/*.{js,ts}'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
    },
    // ESLint Vue from web tests
    {
      files: ['**/packages/client/test/integration/test-web/src/**/*.vue'],
      extends: [
        'plugin:vue/vue3-recommended',
        // no real need to apply type checked linting rules for integration tests
        'plugin:@typescript-eslint/disable-type-checked',
      ],
      parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
      },
      rules: {
        'vue/html-indent': ['warn', 2],
      },
    },
    // Jakefiles
    {
      files: ['packages/crypto/etc/jakefile.ts', 'etc/jakefile.ts'],
      globals: {
        desc: true,
        task: true,
        namespace: true,
      },
    },
  ],
}
