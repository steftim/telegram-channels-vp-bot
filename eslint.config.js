// const prettier = require('eslint-plugin-prettier');
import prettier from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            prettier
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {}
            }
        },
        rules: {
            'no-console': 0,
            'prettier/prettier': ['error'],
            'import/extensions': 0,
            'import/prefer-default-export': 'off',
            'import/no-unresolved': 0,
            'no-duplicate-imports': ['error', { includeExports: true }],
            'react/prop-types': 0,
            'no-underscore-dangle': 0,
            'no-param-reassign': ['error', { props: false }],
            'no-case-declarations': 0,
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'space-infix-ops': ['error', { int32Hint: false }]
            // 'no-unused-vars': ['error', { argsIgnorePattern: 'next' }]
        }
        // ... others are omitted for brevity
    }
];
