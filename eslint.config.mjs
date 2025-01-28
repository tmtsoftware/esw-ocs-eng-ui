// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  ...pluginReact.configs.flat.recommended,
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
    // '@typescript-eslint/no-unused-expressions': [
    //   'warn',
    //   {
    //     allowShortCircuit: true,
    //     allowTernary: true,
    //     allowTaggedTemplates: true
    //   }
    // ],
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  languageOptions: {
    globals: globals.node
  }
})
