import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    {
        languageOptions: {
            parserOptions: { project: './tsconfig.json' }
        }
    },
    {
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'lf' }],
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
        }
    },
    {
        files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-unsafe-assignment': 'off'
        }
    },
    {
        files: ['eslint.config.mjs'],
        ...tseslint.configs.disableTypeChecked
    },
    prettierConfig,
    prettierPlugin
);
