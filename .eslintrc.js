module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true,
        },
        parser: "@typescript-eslint/parser",
    },
    plugins: ['react', 'simple-import-sort'],
    rules: {
        "no-console": "off",
        "no-underscore-dangle": "off",
        "no-plusplus": "off",
        "no-continue": "off",
        "camelcase": "off",
        "no-empty": "off",
        "no-param-reassign": "off",
        "no-unused-vars": "off",
        "no-undef": "off",
        "no-dupe-class-members": "off",
        "func-names": [
            "error",
            "never"
        ],
        "prefer-destructuring": [
            "error",
            {
                "object": false,
                "array": false
            }
        ],
        indent: ['error', 2, { SwitchCase: 1 }],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        semi: ['error', 'never'],
        'react/jsx-uses-vars': 1,
        'react/jsx-uses-react': 1,
        'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
    },
    "overrides": [
        // override "simple-import-sort" config
        {
          "files": ["*.js", "*.jsx", "*.ts", "*.tsx"],
          "rules": {
            "simple-import-sort/imports": [
              "error",
              {
                "groups": [
                  ["@babel/polyfill"],
                  // Packages `react` related packages come first.
                  ["^react", "^@?\\w"],
                  // Internal packages.
                  ["^(@|components)(/.*|$)"],
                  // Side effect imports.
                  ["^\\u0000"],
                  // Parent imports. Put `..` last.
                  ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                  // Other relative imports. Put same-folder imports and `.` last.
                  ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                  // Style imports.
                  ["^.+\\.?(css)$"]
                ]
              }
            ]
          }
        }
      ]
};
