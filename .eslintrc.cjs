module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./**/(tsconfig.src|tsconfig.test|tsconfig.cli).json",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: [
    "**/*.d.ts",
    "**/*.js",
    "example/**/*",
    "tests/**/*.test.ts",
  ],
  rules: {
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-nocheck": "allow-with-description",
        "ts-nocheck": true,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        args: "after-used",
      },
    ],
    // "no-console": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/method-signature-style": ["error", "property"],
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "type",
          "internal",
          "parent",
          "index",
          "sibling",
          "object",
          "unknown",
        ],
        pathGroups: [
          // 上に書いたものが上に並ぶ
          {
            pattern: "@/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "~/**",
            group: "internal",
            position: "before",
          },
        ],
        alphabetize: {
          order: "asc",
        },
        "newlines-between": "never",
      },
    ],
  },
}
